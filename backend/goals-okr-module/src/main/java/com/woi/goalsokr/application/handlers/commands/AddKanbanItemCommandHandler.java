package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.AddKanbanItemCommand;
import com.woi.goalsokr.application.results.KanbanItemResult;
import com.woi.goalsokr.domain.entities.KanbanItem;
import com.woi.goalsokr.domain.enums.EntityType;
import com.woi.goalsokr.domain.enums.ItemType;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import com.woi.goalsokr.domain.services.EntityNumberGenerator;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for adding a kanban item
 */
@Component
public class AddKanbanItemCommandHandler {
    private final KanbanItemRepository kanbanItemRepository;
    private final UserModuleInterface userModule;
    private final EntityNumberGenerator numberGenerator;

    public AddKanbanItemCommandHandler(
            KanbanItemRepository kanbanItemRepository,
            UserModuleInterface userModule,
            EntityNumberGenerator numberGenerator) {
        this.kanbanItemRepository = kanbanItemRepository;
        this.userModule = userModule;
        this.numberGenerator = numberGenerator;
    }

    @Transactional(noRollbackFor = {IllegalArgumentException.class})
    public KanbanItemResult handle(AddKanbanItemCommand command) {
        // Validate user exists
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        // Check if item already exists
        ItemType itemType;
        try {
            itemType = ItemType.valueOf(command.itemType());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid item type: " + command.itemType() + ". Must be one of: GOAL, USER_GOAL, OBJECTIVE, KEY_RESULT, INITIATIVE");
        }
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

        // Generate unique number
        String number = numberGenerator.generateNextNumber(EntityType.KANBAN_ITEM);
        item.setNumber(number);

        // Save item
        KanbanItem savedItem = kanbanItemRepository.save(item);

        // Return result
        return KanbanItemResult.from(savedItem);
    }
}
