package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.AddKanbanItemCommand;
import com.woi.goalsokr.application.commands.CreateObjectiveCommand;
import com.woi.goalsokr.application.commands.CreatePersonalObjectiveCommand;
import com.woi.goalsokr.application.commands.StartUserObjectiveInstanceCommand;
import com.woi.goalsokr.application.results.UserObjectiveInstanceResult;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a personal objective.
 * 
 * This handler:
 * 1. Gets the Goal ID from the UserGoalInstance
 * 2. Creates an Objective template
 * 3. Starts a UserObjectiveInstance for the user
 * 4. Adds the instance to the kanban board (type OBJECTIVE, itemId = userObjectiveInstanceId)
 */
@Component
public class CreatePersonalObjectiveCommandHandler {
    private final CreateObjectiveCommandHandler createObjectiveHandler;
    private final StartUserObjectiveInstanceCommandHandler startInstanceHandler;
    private final AddKanbanItemCommandHandler addKanbanItemHandler;
    private final ObjectiveRepository objectiveRepository;
    private final UserGoalInstanceRepository userGoalInstanceRepository;
    private final UserModuleInterface userModule;

    public CreatePersonalObjectiveCommandHandler(
            CreateObjectiveCommandHandler createObjectiveHandler,
            StartUserObjectiveInstanceCommandHandler startInstanceHandler,
            AddKanbanItemCommandHandler addKanbanItemHandler,
            ObjectiveRepository objectiveRepository,
            UserGoalInstanceRepository userGoalInstanceRepository,
            UserModuleInterface userModule) {
        this.createObjectiveHandler = createObjectiveHandler;
        this.startInstanceHandler = startInstanceHandler;
        this.addKanbanItemHandler = addKanbanItemHandler;
        this.objectiveRepository = objectiveRepository;
        this.userGoalInstanceRepository = userGoalInstanceRepository;
        this.userModule = userModule;
    }

    @Transactional
    public UserObjectiveInstanceResult handle(CreatePersonalObjectiveCommand command) {
        // Validate user exists
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        // Get UserGoalInstance to find the Goal ID
        var userGoalInstance = userGoalInstanceRepository.findById(command.userGoalInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User Goal Instance not found: " + command.userGoalInstanceId()));

        // Validate that the UserGoalInstance belongs to the user
        if (!userGoalInstance.getUserId().equals(command.userId())) {
            throw new IllegalArgumentException("User Goal Instance does not belong to user: " + command.userId());
        }

        Long goalId = userGoalInstance.getGoalId();

        // Calculate next orderIndex for this goal
        var existingObjectives = objectiveRepository.findByGoalId(goalId);
        int nextOrderIndex = existingObjectives.size() + 1;

        // 1. Create Objective template
        var objectiveResult = createObjectiveHandler.handle(new CreateObjectiveCommand(
            goalId,
            null, // titleNl - not provided for personal objectives
            command.title(), // titleEn
            null, // descriptionNl - not provided
            command.description(), // descriptionEn
            nextOrderIndex
        ));

        // 2. Start UserObjectiveInstance immediately
        var instanceResult = startInstanceHandler.handle(
            new StartUserObjectiveInstanceCommand(
                command.userId(),
                command.userGoalInstanceId(),
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
