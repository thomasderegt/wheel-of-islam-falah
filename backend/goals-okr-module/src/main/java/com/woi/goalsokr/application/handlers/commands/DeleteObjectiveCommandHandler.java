package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.DeleteKanbanItemCommand;
import com.woi.goalsokr.application.commands.DeleteObjectiveCommand;
import com.woi.goalsokr.domain.entities.KeyResult;
import com.woi.goalsokr.domain.entities.Objective;
import com.woi.goalsokr.domain.entities.UserInitiative;
import com.woi.goalsokr.domain.entities.UserInitiativeInstance;
import com.woi.goalsokr.domain.entities.UserKeyResultInstance;
import com.woi.goalsokr.domain.entities.UserObjectiveInstance;
import com.woi.goalsokr.domain.enums.ItemType;
import com.woi.goalsokr.domain.repositories.KeyResultProgressRepository;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Command handler for deleting an objective.
 * Cascades deletion of UserObjectiveInstances (and their kanban items, key result instances,
 * initiatives, etc.) so personal objectives on the kanban can be deleted.
 * Then deletes all key results under this objective, and finally the objective.
 */
@Component
public class DeleteObjectiveCommandHandler {
    private final ObjectiveRepository objectiveRepository;
    private final KeyResultRepository keyResultRepository;
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final KeyResultProgressRepository keyResultProgressRepository;
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;
    private final UserInitiativeRepository userInitiativeRepository;
    private final KanbanItemRepository kanbanItemRepository;
    private final DeleteKanbanItemCommandHandler deleteKanbanItemHandler;

    public DeleteObjectiveCommandHandler(
            ObjectiveRepository objectiveRepository,
            KeyResultRepository keyResultRepository,
            UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            KeyResultProgressRepository keyResultProgressRepository,
            UserInitiativeInstanceRepository userInitiativeInstanceRepository,
            UserInitiativeRepository userInitiativeRepository,
            KanbanItemRepository kanbanItemRepository,
            DeleteKanbanItemCommandHandler deleteKanbanItemHandler) {
        this.objectiveRepository = objectiveRepository;
        this.keyResultRepository = keyResultRepository;
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.keyResultProgressRepository = keyResultProgressRepository;
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
        this.userInitiativeRepository = userInitiativeRepository;
        this.kanbanItemRepository = kanbanItemRepository;
        this.deleteKanbanItemHandler = deleteKanbanItemHandler;
    }

    @Transactional
    public void handle(DeleteObjectiveCommand command) {
        Objective objective = objectiveRepository.findById(command.objectiveId())
            .orElseThrow(() -> new IllegalArgumentException("Objective not found with id: " + command.objectiveId()));

        List<UserObjectiveInstance> instances = userObjectiveInstanceRepository.findByObjectiveId(objective.getId());
        for (UserObjectiveInstance uoi : instances) {
            deleteUserObjectiveInstance(uoi);
        }

        List<KeyResult> keyResults = keyResultRepository.findByObjectiveId(objective.getId());
        for (KeyResult kr : keyResults) {
            keyResultRepository.delete(kr);
        }
        objectiveRepository.delete(objective);
    }

    private void deleteUserObjectiveInstance(UserObjectiveInstance uoi) {
        Long userId = uoi.getUserId();
        List<UserKeyResultInstance> krInstances = userKeyResultInstanceRepository.findByUserObjectiveInstanceId(uoi.getId());
        for (UserKeyResultInstance ukri : krInstances) {
            deleteUserKeyResultInstance(ukri, userId);
        }
        kanbanItemRepository.findByUserIdAndItemTypeAndItemId(userId, ItemType.OBJECTIVE, uoi.getId())
            .ifPresent(item -> deleteKanbanItemHandler.handle(new DeleteKanbanItemCommand(item.getId())));
        userObjectiveInstanceRepository.delete(uoi);
    }

    private void deleteUserKeyResultInstance(UserKeyResultInstance ukri, Long userId) {
        keyResultProgressRepository.findByUserKeyResultInstanceId(ukri.getId())
            .forEach(keyResultProgressRepository::delete);

        List<UserInitiativeInstance> initiativeInstances = userInitiativeInstanceRepository.findByUserKeyResultInstanceId(ukri.getId());
        for (UserInitiativeInstance uii : initiativeInstances) {
            kanbanItemRepository.findByUserIdAndItemTypeAndItemId(userId, ItemType.INITIATIVE, uii.getId())
                .ifPresent(item -> deleteKanbanItemHandler.handle(new DeleteKanbanItemCommand(item.getId())));
            userInitiativeInstanceRepository.delete(uii);
        }

        List<UserInitiative> userInitiatives = userInitiativeRepository.findByUserKeyResultInstanceId(ukri.getId());
        for (UserInitiative ui : userInitiatives) {
            userInitiativeRepository.delete(ui);
        }

        kanbanItemRepository.findByUserIdAndItemTypeAndItemId(userId, ItemType.KEY_RESULT, ukri.getId())
            .ifPresent(item -> deleteKanbanItemHandler.handle(new DeleteKanbanItemCommand(item.getId())));
        userKeyResultInstanceRepository.delete(ukri);
    }
}
