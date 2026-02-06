package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.UpdateKanbanItemPositionCommand;
import com.woi.goalsokr.application.results.KanbanItemResult;
import com.woi.goalsokr.domain.entities.KanbanItem;
import com.woi.goalsokr.domain.enums.KanbanColumn;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for updating kanban item position
 */
@Component
public class UpdateKanbanItemPositionCommandHandler {
    private final KanbanItemRepository kanbanItemRepository;

    public UpdateKanbanItemPositionCommandHandler(KanbanItemRepository kanbanItemRepository) {
        this.kanbanItemRepository = kanbanItemRepository;
    }

    @Transactional
    public KanbanItemResult handle(UpdateKanbanItemPositionCommand command) {
        // Find item
        KanbanItem item = kanbanItemRepository.findById(command.itemId())
            .orElseThrow(() -> new IllegalArgumentException("KanbanItem not found with id: " + command.itemId()));

        // Update position
        KanbanColumn column = KanbanColumn.valueOf(command.columnName());
        item.updatePosition(column, command.position());

        // Save item
        KanbanItem savedItem = kanbanItemRepository.save(item);

        // Return result
        return KanbanItemResult.from(savedItem);
    }
}
