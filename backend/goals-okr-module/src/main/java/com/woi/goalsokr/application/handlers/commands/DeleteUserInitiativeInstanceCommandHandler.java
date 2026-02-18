package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.DeleteKanbanItemCommand;
import com.woi.goalsokr.application.commands.DeleteUserInitiativeInstanceCommand;
import com.woi.goalsokr.domain.entities.UserInitiativeInstance;
import com.woi.goalsokr.domain.enums.ItemType;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for deleting a user initiative instance.
 * Removes the instance and any related kanban board item.
 */
@Component
public class DeleteUserInitiativeInstanceCommandHandler {
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;
    private final KanbanItemRepository kanbanItemRepository;
    private final DeleteKanbanItemCommandHandler deleteKanbanItemHandler;

    public DeleteUserInitiativeInstanceCommandHandler(
            UserInitiativeInstanceRepository userInitiativeInstanceRepository,
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            KanbanItemRepository kanbanItemRepository,
            DeleteKanbanItemCommandHandler deleteKanbanItemHandler) {
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.kanbanItemRepository = kanbanItemRepository;
        this.deleteKanbanItemHandler = deleteKanbanItemHandler;
    }

    @Transactional
    public void handle(DeleteUserInitiativeInstanceCommand command) {
        UserInitiativeInstance instance = userInitiativeInstanceRepository.findById(command.userInitiativeInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User initiative instance not found with id: " + command.userInitiativeInstanceId()));

        var userKeyResultInstance = userKeyResultInstanceRepository.findById(instance.getUserKeyResultInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User key result instance not found"));
        var userObjectiveInstance = userObjectiveInstanceRepository.findById(userKeyResultInstance.getUserObjectiveInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User objective instance not found"));
        Long userId = userObjectiveInstance.getUserId();

        kanbanItemRepository.findByUserIdAndItemTypeAndItemId(userId, ItemType.INITIATIVE, instance.getId())
            .ifPresent(kanbanItem -> deleteKanbanItemHandler.handle(new DeleteKanbanItemCommand(kanbanItem.getId())));
        userInitiativeInstanceRepository.delete(instance);
    }
}
