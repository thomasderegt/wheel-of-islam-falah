package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.UpdateKanbanItemNotesCommand;
import com.woi.goalsokr.application.results.KanbanItemResult;
import com.woi.goalsokr.domain.entities.KanbanItem;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for updating kanban item notes
 */
@Component
public class UpdateKanbanItemNotesCommandHandler {
    private final KanbanItemRepository kanbanItemRepository;

    public UpdateKanbanItemNotesCommandHandler(KanbanItemRepository kanbanItemRepository) {
        this.kanbanItemRepository = kanbanItemRepository;
    }

    @Transactional
    public KanbanItemResult handle(UpdateKanbanItemNotesCommand command) {
        // Find item
        KanbanItem item = kanbanItemRepository.findById(command.itemId())
            .orElseThrow(() -> new IllegalArgumentException("KanbanItem not found with id: " + command.itemId()));

        // Update notes (can be null or empty to clear)
        String notes = command.notes() != null && command.notes().trim().isEmpty() 
            ? null 
            : command.notes();
        item.updateNotes(notes);

        // Save item
        KanbanItem savedItem = kanbanItemRepository.save(item);

        // Return result
        return KanbanItemResult.from(savedItem);
    }
}
