package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.DeleteKanbanItemCommand;
import com.woi.goalsokr.application.commands.DeleteUserInitiativeCommand;
import com.woi.goalsokr.domain.entities.UserInitiative;
import com.woi.goalsokr.domain.entities.UserInitiativeInstance;
import com.woi.goalsokr.domain.enums.ItemType;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Command handler for deleting a user initiative.
 * Removes the initiative, its instance(s), and any related kanban board items.
 */
@Component
public class DeleteUserInitiativeCommandHandler {
    private final UserInitiativeRepository userInitiativeRepository;
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;
    private final KanbanItemRepository kanbanItemRepository;
    private final DeleteKanbanItemCommandHandler deleteKanbanItemHandler;

    public DeleteUserInitiativeCommandHandler(
            UserInitiativeRepository userInitiativeRepository,
            UserInitiativeInstanceRepository userInitiativeInstanceRepository,
            KanbanItemRepository kanbanItemRepository,
            DeleteKanbanItemCommandHandler deleteKanbanItemHandler) {
        this.userInitiativeRepository = userInitiativeRepository;
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
        this.kanbanItemRepository = kanbanItemRepository;
        this.deleteKanbanItemHandler = deleteKanbanItemHandler;
    }

    @Transactional
    public void handle(DeleteUserInitiativeCommand command) {
        UserInitiative initiative = userInitiativeRepository.findById(command.initiativeId())
            .orElseThrow(() -> new IllegalArgumentException("User initiative not found with id: " + command.initiativeId()));

        Long userId = initiative.getUserId();
        List<UserInitiativeInstance> instances = userInitiativeInstanceRepository.findByInitiativeId(initiative.getId());

        for (UserInitiativeInstance instance : instances) {
            kanbanItemRepository.findByUserIdAndItemTypeAndItemId(userId, ItemType.INITIATIVE, instance.getId())
                .ifPresent(kanbanItem -> deleteKanbanItemHandler.handle(new DeleteKanbanItemCommand(kanbanItem.getId())));
            userInitiativeInstanceRepository.delete(instance);
        }

        userInitiativeRepository.delete(initiative);
    }
}
