package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.DeleteKanbanItemCommand;
import com.woi.goalsokr.domain.entities.KanbanItem;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for deleting a kanban item
 */
@Component
public class DeleteKanbanItemCommandHandler {
    private final KanbanItemRepository kanbanItemRepository;

    public DeleteKanbanItemCommandHandler(KanbanItemRepository kanbanItemRepository) {
        this.kanbanItemRepository = kanbanItemRepository;
    }

    @Transactional
    public void handle(DeleteKanbanItemCommand command) {
        // Find item
        KanbanItem item = kanbanItemRepository.findById(command.itemId())
            .orElseThrow(() -> new IllegalArgumentException("KanbanItem not found with id: " + command.itemId()));

        // Delete item
        kanbanItemRepository.delete(item);
    }
}
