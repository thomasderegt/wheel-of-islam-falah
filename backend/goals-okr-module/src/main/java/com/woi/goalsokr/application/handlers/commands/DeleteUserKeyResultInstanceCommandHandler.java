package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.DeleteKanbanItemCommand;
import com.woi.goalsokr.application.commands.DeleteUserKeyResultInstanceCommand;
import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.entities.UserInitiativeInstance;
import com.woi.goalsokr.domain.entities.UserKeyResultInstance;
import com.woi.goalsokr.domain.entities.UserObjectiveInstance;
import com.woi.goalsokr.domain.enums.ItemType;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.domain.repositories.KeyResultProgressRepository;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Command handler for deleting a user key result instance.
 * Cascades to initiative instances and kanban items.
 */
@Component
public class DeleteUserKeyResultInstanceCommandHandler {
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;
    private final KeyResultProgressRepository keyResultProgressRepository;
    private final KeyResultRepository keyResultRepository;
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;
    private final InitiativeRepository initiativeRepository;
    private final KanbanItemRepository kanbanItemRepository;
    private final DeleteKanbanItemCommandHandler deleteKanbanItemHandler;

    public DeleteUserKeyResultInstanceCommandHandler(
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            KeyResultProgressRepository keyResultProgressRepository,
            KeyResultRepository keyResultRepository,
            UserInitiativeInstanceRepository userInitiativeInstanceRepository,
            InitiativeRepository initiativeRepository,
            KanbanItemRepository kanbanItemRepository,
            DeleteKanbanItemCommandHandler deleteKanbanItemHandler) {
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.keyResultProgressRepository = keyResultProgressRepository;
        this.keyResultRepository = keyResultRepository;
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
        this.initiativeRepository = initiativeRepository;
        this.kanbanItemRepository = kanbanItemRepository;
        this.deleteKanbanItemHandler = deleteKanbanItemHandler;
    }

    @Transactional
    public void handle(DeleteUserKeyResultInstanceCommand command) {
        UserKeyResultInstance instance = userKeyResultInstanceRepository.findById(command.userKeyResultInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User key result instance not found with id: " + command.userKeyResultInstanceId()));

        UserObjectiveInstance userObjectiveInstance = userObjectiveInstanceRepository.findById(instance.getUserObjectiveInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User objective instance not found"));
        Long userId = userObjectiveInstance.getUserId();

        keyResultProgressRepository.findByUserKeyResultInstanceId(instance.getId())
            .forEach(keyResultProgressRepository::delete);

        List<UserInitiativeInstance> initiativeInstances = userInitiativeInstanceRepository.findByUserKeyResultInstanceId(instance.getId());
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

        kanbanItemRepository.findByUserIdAndItemTypeAndItemId(userId, ItemType.KEY_RESULT, instance.getId())
            .ifPresent(item -> deleteKanbanItemHandler.handle(new DeleteKanbanItemCommand(item.getId())));
        var keyResultOpt = keyResultRepository.findById(instance.getKeyResultId());
        userKeyResultInstanceRepository.delete(instance);
        keyResultOpt.ifPresent(kr -> {
            if (kr.getCreatedByUserId() != null) {
                keyResultRepository.delete(kr);
            }
        });
    }
}
