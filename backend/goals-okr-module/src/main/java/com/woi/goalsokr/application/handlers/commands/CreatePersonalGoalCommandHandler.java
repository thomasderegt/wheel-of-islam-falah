package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.AddKanbanItemCommand;
import com.woi.goalsokr.application.commands.CreateGoalCommand;
import com.woi.goalsokr.application.commands.CreatePersonalGoalCommand;
import com.woi.goalsokr.application.commands.StartUserGoalInstanceCommand;
import com.woi.goalsokr.application.results.UserGoalInstanceResult;
import com.woi.goalsokr.domain.repositories.GoalRepository;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a personal goal.
 * 
 * This handler:
 * 1. Creates a Goal template
 * 2. Starts a UserGoalInstance for the user
 * 3. Adds the instance to the kanban board (type GOAL, itemId = userGoalInstanceId)
 * 
 * This is the new approach: Goal template + instance, instead of direct UserGoal creation.
 */
@Component
public class CreatePersonalGoalCommandHandler {
    private final CreateGoalCommandHandler createGoalHandler;
    private final StartUserGoalInstanceCommandHandler startInstanceHandler;
    private final AddKanbanItemCommandHandler addKanbanItemHandler;
    private final GoalRepository goalRepository;
    private final UserModuleInterface userModule;

    public CreatePersonalGoalCommandHandler(
            CreateGoalCommandHandler createGoalHandler,
            StartUserGoalInstanceCommandHandler startInstanceHandler,
            AddKanbanItemCommandHandler addKanbanItemHandler,
            GoalRepository goalRepository,
            UserModuleInterface userModule) {
        this.createGoalHandler = createGoalHandler;
        this.startInstanceHandler = startInstanceHandler;
        this.addKanbanItemHandler = addKanbanItemHandler;
        this.goalRepository = goalRepository;
        this.userModule = userModule;
    }

    @Transactional
    public UserGoalInstanceResult handle(CreatePersonalGoalCommand command) {
        // Validate user exists
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        // Calculate next orderIndex for this life domain
        var existingGoals = goalRepository.findByLifeDomainId(command.lifeDomainId());
        int nextOrderIndex = existingGoals.size() + 1;

        // 1. Create Goal template
        var goalResult = createGoalHandler.handle(new CreateGoalCommand(
            command.lifeDomainId(),
            null, // titleNl - not provided for personal goals
            command.title(), // titleEn
            null, // descriptionNl - not provided
            command.description(), // descriptionEn
            nextOrderIndex,
            null, // quarter - not applicable for personal goals
            null  // year - not applicable for personal goals
        ));

        // 2. Start UserGoalInstance immediately
        var instanceResult = startInstanceHandler.handle(
            new StartUserGoalInstanceCommand(command.userId(), goalResult.id())
        );

        // 3. Add to kanban board (type GOAL, itemId = userGoalInstanceId)
        // Note: For GOAL items in kanban, itemId refers to userGoalInstanceId, not goalId
        try {
            addKanbanItemHandler.handle(new AddKanbanItemCommand(
                command.userId(),
                "GOAL",
                instanceResult.id() // userGoalInstanceId
            ));
        } catch (IllegalArgumentException e) {
            // If item already exists in kanban, that's okay - don't fail the creation
            // This can happen if the user already has this goal instance in their kanban
            System.err.println("Note: Goal instance already in kanban: " + e.getMessage());
        }

        return instanceResult;
    }
}
