package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.AddKanbanItemCommand;
import com.woi.goalsokr.application.commands.CreateObjectiveCommand;
import com.woi.goalsokr.application.commands.CreateCustomObjectiveCommand;
import com.woi.goalsokr.application.commands.StartUserObjectiveInstanceCommand;
import com.woi.goalsokr.application.results.UserObjectiveInstanceResult;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a custom objective.
 * 1. Creates an Objective template under the given life domain
 * 2. Starts a UserObjectiveInstance for the user
 * 3. Adds the instance to the kanban board (type OBJECTIVE, itemId = userObjectiveInstanceId)
 */
@Component
public class CreateCustomObjectiveCommandHandler {
    private final CreateObjectiveCommandHandler createObjectiveHandler;
    private final StartUserObjectiveInstanceCommandHandler startInstanceHandler;
    private final AddKanbanItemCommandHandler addKanbanItemHandler;
    private final ObjectiveRepository objectiveRepository;
    private final UserModuleInterface userModule;

    public CreateCustomObjectiveCommandHandler(
            CreateObjectiveCommandHandler createObjectiveHandler,
            StartUserObjectiveInstanceCommandHandler startInstanceHandler,
            AddKanbanItemCommandHandler addKanbanItemHandler,
            ObjectiveRepository objectiveRepository,
            UserModuleInterface userModule) {
        this.createObjectiveHandler = createObjectiveHandler;
        this.startInstanceHandler = startInstanceHandler;
        this.addKanbanItemHandler = addKanbanItemHandler;
        this.objectiveRepository = objectiveRepository;
        this.userModule = userModule;
    }

    @Transactional
    public UserObjectiveInstanceResult handle(CreateCustomObjectiveCommand command) {
        // Validate user exists
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        // Calculate next orderIndex for this life domain
        var existingObjectives = objectiveRepository.findByLifeDomainId(command.lifeDomainId());
        int nextOrderIndex = existingObjectives.size() + 1;

        // 1. Create Objective (custom - with created_by_user_id)
        var objectiveResult = createObjectiveHandler.handle(new CreateObjectiveCommand(
            command.lifeDomainId(),
            null, // titleNl - not provided for custom objectives
            command.title(), // titleEn
            null, // descriptionNl - not provided
            command.description(), // descriptionEn
            nextOrderIndex,
            command.userId() // created_by_user_id for custom objectives
        ));

        // Ensure created_by_user_id is persisted (explicit update as safeguard)
        objectiveRepository.updateCreatedByUserId(objectiveResult.id(), command.userId());

        // 2. Start UserObjectiveInstance immediately
        var instanceResult = startInstanceHandler.handle(
            new StartUserObjectiveInstanceCommand(
                command.userId(),
                objectiveResult.id()
            )
        );

        // 3. Add to kanban board (type OBJECTIVE, itemId = userObjectiveInstanceId)
        try {
            addKanbanItemHandler.handle(new AddKanbanItemCommand(
                command.userId(),
                "OBJECTIVE",
                instanceResult.id() // userObjectiveInstanceId
            ));
        } catch (IllegalArgumentException e) {
            // If item already exists in kanban, that's okay - don't fail the creation
            System.err.println("Note: Objective instance already in kanban: " + e.getMessage());
        }

        return instanceResult;
    }
}
