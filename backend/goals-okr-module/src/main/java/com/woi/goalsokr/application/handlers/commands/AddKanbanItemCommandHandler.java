package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.AddKanbanItemCommand;
import com.woi.goalsokr.application.results.KanbanItemResult;
import com.woi.goalsokr.domain.entities.KanbanItem;
import com.woi.goalsokr.domain.enums.ItemType;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for adding a kanban item
 */
@Component
public class AddKanbanItemCommandHandler {
    private final KanbanItemRepository kanbanItemRepository;

    public AddKanbanItemCommandHandler(KanbanItemRepository kanbanItemRepository) {
        this.kanbanItemRepository = kanbanItemRepository;
    }

    @Transactional
    public KanbanItemResult handle(AddKanbanItemCommand command) {
        // Check if item already exists
        ItemType itemType = ItemType.valueOf(command.itemType());
        kanbanItemRepository.findByUserIdAndItemTypeAndItemId(
            command.userId(),
            itemType,
            command.itemId()
        ).ifPresent(existing -> {
            throw new IllegalArgumentException("Item already exists in kanban board");
        });

        // Create kanban item (domain factory method validates)
        KanbanItem item = KanbanItem.create(
            command.userId(),
            itemType,
            command.itemId()
        );

        // Save item
        KanbanItem savedItem = kanbanItemRepository.save(item);

        // Return result
        return KanbanItemResult.from(savedItem);
    }
}
