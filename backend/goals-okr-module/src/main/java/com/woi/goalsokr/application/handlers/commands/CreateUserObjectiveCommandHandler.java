package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CreateUserObjectiveCommand;
import com.woi.goalsokr.application.results.UserObjectiveResult;
import com.woi.goalsokr.domain.entities.UserGoal;
import com.woi.goalsokr.domain.entities.UserObjective;
import com.woi.goalsokr.domain.enums.EntityType;
import com.woi.goalsokr.domain.repositories.UserGoalRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveRepository;
import com.woi.goalsokr.domain.services.EntityNumberGenerator;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a new user-specific objective
 */
@Component
public class CreateUserObjectiveCommandHandler {
    private final UserObjectiveRepository userObjectiveRepository;
    private final UserGoalRepository userGoalRepository;
    private final UserModuleInterface userModule;
    private final EntityNumberGenerator numberGenerator;

    public CreateUserObjectiveCommandHandler(
        UserObjectiveRepository userObjectiveRepository,
        UserGoalRepository userGoalRepository,
        UserModuleInterface userModule,
        EntityNumberGenerator numberGenerator
    ) {
        this.userObjectiveRepository = userObjectiveRepository;
        this.userGoalRepository = userGoalRepository;
        this.userModule = userModule;
        this.numberGenerator = numberGenerator;
    }

    @Transactional
    public UserObjectiveResult handle(CreateUserObjectiveCommand command) {
        // Validate user exists
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        // Validate user goal exists and belongs to user
        UserGoal userGoal = userGoalRepository.findById(command.userGoalId())
            .orElseThrow(() -> new IllegalArgumentException("User goal not found: " + command.userGoalId()));

        if (!userGoal.getUserId().equals(command.userId())) {
            throw new IllegalArgumentException("User goal does not belong to user: " + command.userId());
        }

        // Create user objective (domain factory method validates)
        UserObjective userObjective = UserObjective.create(
            command.userId(),
            command.userGoalId(),
            command.title()
        );

        // Set optional fields
        if (command.description() != null) {
            userObjective.updateDescription(command.description());
        }

        // Generate unique number
        String number = numberGenerator.generateNextNumber(EntityType.USER_OBJECTIVE);
        userObjective.setNumber(number);

        // Save user objective
        UserObjective savedUserObjective = userObjectiveRepository.save(userObjective);

        // Return result
        return UserObjectiveResult.from(savedUserObjective);
    }
}
