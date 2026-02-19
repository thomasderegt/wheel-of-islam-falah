package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.DeleteKanbanItemCommand;
import com.woi.goalsokr.application.commands.DeleteUserObjectiveInstanceCommand;
import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.entities.UserInitiativeInstance;
import com.woi.goalsokr.domain.entities.UserKeyResultInstance;
import com.woi.goalsokr.domain.entities.UserObjectiveInstance;
import com.woi.goalsokr.domain.enums.ItemType;
import com.woi.goalsokr.domain.repositories.KeyResultProgressRepository;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Command handler for deleting a user objective instance.
 * Cascades to key result instances, initiative instances, and kanban items.
 */
@Component
public class DeleteUserObjectiveInstanceCommandHandler {
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final KeyResultProgressRepository keyResultProgressRepository;
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;
    private final InitiativeRepository initiativeRepository;
    private final KeyResultRepository keyResultRepository;
    private final KanbanItemRepository kanbanItemRepository;
    private final DeleteKanbanItemCommandHandler deleteKanbanItemHandler;

    public DeleteUserObjectiveInstanceCommandHandler(
            UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            KeyResultProgressRepository keyResultProgressRepository,
            UserInitiativeInstanceRepository userInitiativeInstanceRepository,
            InitiativeRepository initiativeRepository,
            KeyResultRepository keyResultRepository,
            KanbanItemRepository kanbanItemRepository,
            DeleteKanbanItemCommandHandler deleteKanbanItemHandler) {
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.keyResultProgressRepository = keyResultProgressRepository;
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
        this.initiativeRepository = initiativeRepository;
        this.keyResultRepository = keyResultRepository;
        this.kanbanItemRepository = kanbanItemRepository;
        this.deleteKanbanItemHandler = deleteKanbanItemHandler;
    }

    @Transactional
    public void handle(DeleteUserObjectiveInstanceCommand command) {
        UserObjectiveInstance instance = userObjectiveInstanceRepository.findById(command.userObjectiveInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User objective instance not found with id: " + command.userObjectiveInstanceId()));

        Long userId = instance.getUserId();

        List<UserKeyResultInstance> krInstances = userKeyResultInstanceRepository.findByUserObjectiveInstanceId(instance.getId());
        for (UserKeyResultInstance ukri : krInstances) {
            deleteUserKeyResultInstance(ukri, userId);
        }

        kanbanItemRepository.findByUserIdAndItemTypeAndItemId(userId, ItemType.OBJECTIVE, instance.getId())
            .ifPresent(item -> deleteKanbanItemHandler.handle(new DeleteKanbanItemCommand(item.getId())));
        userObjectiveInstanceRepository.delete(instance);
    }

    private void deleteUserKeyResultInstance(UserKeyResultInstance ukri, Long userId) {
        keyResultProgressRepository.findByUserKeyResultInstanceId(ukri.getId())
            .forEach(keyResultProgressRepository::delete);

        List<UserInitiativeInstance> initiativeInstances = userInitiativeInstanceRepository.findByUserKeyResultInstanceId(ukri.getId());
        for (UserInitiativeInstance uii : initiativeInstances) {
            kanbanItemRepository.findByUserIdAndItemTypeAndItemId(userId, ItemType.INITIATIVE, uii.getId())
                .ifPresent(item -> deleteKanbanItemHandler.handle(new DeleteKanbanItemCommand(item.getId())));
            var initiativeOpt = initiativeRepository.findById(uii.getInitiativeId());
            userInitiativeInstanceRepository.delete(uii);
            initiativeOpt.ifPresent(init -> {
                if (init.getCreatedByUserId() != null) {
                    initiativeRepository.delete(init.getId());
                }
            });
        }

        kanbanItemRepository.findByUserIdAndItemTypeAndItemId(userId, ItemType.KEY_RESULT, ukri.getId())
            .ifPresent(item -> deleteKanbanItemHandler.handle(new DeleteKanbanItemCommand(item.getId())));
        var keyResultOpt = keyResultRepository.findById(ukri.getKeyResultId());
        userKeyResultInstanceRepository.delete(ukri);
        keyResultOpt.ifPresent(kr -> {
            if (kr.getCreatedByUserId() != null) {
                keyResultRepository.delete(kr);
            }
        });
    }
}
