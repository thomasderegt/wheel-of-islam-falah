package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CreateUserGoalCommand;
import com.woi.goalsokr.application.results.UserGoalResult;
import com.woi.goalsokr.domain.entities.UserGoal;
import com.woi.goalsokr.domain.repositories.UserGoalRepository;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a new user-specific goal
 */
@Component
public class CreateUserGoalCommandHandler {
    private final UserGoalRepository userGoalRepository;
    private final UserModuleInterface userModule;

    public CreateUserGoalCommandHandler(
            UserGoalRepository userGoalRepository,
            UserModuleInterface userModule) {
        this.userGoalRepository = userGoalRepository;
        this.userModule = userModule;
    }

    @Transactional
    public UserGoalResult handle(CreateUserGoalCommand command) {
        // Validate user exists
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        // Create user goal (domain factory method validates)
        UserGoal userGoal = UserGoal.create(
            command.userId(),
            command.title()
        );

        // Set optional fields
        if (command.lifeDomainId() != null) {
            userGoal.setLifeDomain(command.lifeDomainId());
        }
        if (command.description() != null) {
            userGoal.updateDescription(command.description());
        }

        // Save user goal
        UserGoal savedUserGoal = userGoalRepository.save(userGoal);

        // Return result
        return UserGoalResult.from(savedUserGoal);
    }
}
