package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.DeleteKanbanItemCommand;
import com.woi.goalsokr.application.commands.DeleteUserInitiativeCommand;
import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.entities.UserInitiativeInstance;
import com.woi.goalsokr.domain.enums.ItemType;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Command handler for deleting a custom initiative.
 * Only removes initiatives with created_by_user_id set (custom initiatives).
 * Removes initiative, its instance(s), and any related kanban board items.
 */
@Component
public class DeleteUserInitiativeCommandHandler {
    private final InitiativeRepository initiativeRepository;
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;
    private final KanbanItemRepository kanbanItemRepository;
    private final DeleteKanbanItemCommandHandler deleteKanbanItemHandler;

    public DeleteUserInitiativeCommandHandler(
            InitiativeRepository initiativeRepository,
            UserInitiativeInstanceRepository userInitiativeInstanceRepository,
            KanbanItemRepository kanbanItemRepository,
            DeleteKanbanItemCommandHandler deleteKanbanItemHandler) {
        this.initiativeRepository = initiativeRepository;
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
        this.kanbanItemRepository = kanbanItemRepository;
        this.deleteKanbanItemHandler = deleteKanbanItemHandler;
    }

    @Transactional
    public void handle(DeleteUserInitiativeCommand command) {
        Initiative initiative = initiativeRepository.findById(command.initiativeId())
            .orElseThrow(() -> new IllegalArgumentException("Initiative not found: " + command.initiativeId()));

        if (initiative.getCreatedByUserId() == null) {
            throw new IllegalArgumentException("Cannot delete template initiative");
        }

        Long userId = initiative.getCreatedByUserId();
        List<UserInitiativeInstance> instances = userInitiativeInstanceRepository.findByInitiativeId(initiative.getId());

        for (UserInitiativeInstance instance : instances) {
            kanbanItemRepository.findByUserIdAndItemTypeAndItemId(userId, ItemType.INITIATIVE, instance.getId())
                .ifPresent(kanbanItem -> deleteKanbanItemHandler.handle(new DeleteKanbanItemCommand(kanbanItem.getId())));
            userInitiativeInstanceRepository.delete(instance);
        }

        initiativeRepository.delete(initiative.getId());
    }
}
