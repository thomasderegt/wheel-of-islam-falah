package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CreateUserKeyResultCommand;
import com.woi.goalsokr.application.results.UserKeyResultResult;
import com.woi.goalsokr.domain.entities.UserKeyResult;
import com.woi.goalsokr.domain.entities.UserObjective;
import com.woi.goalsokr.domain.enums.EntityType;
import com.woi.goalsokr.domain.repositories.UserKeyResultRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveRepository;
import com.woi.goalsokr.domain.services.EntityNumberGenerator;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a new user-specific key result
 */
@Component
public class CreateUserKeyResultCommandHandler {
    private final UserKeyResultRepository userKeyResultRepository;
    private final UserObjectiveRepository userObjectiveRepository;
    private final UserModuleInterface userModule;
    private final EntityNumberGenerator numberGenerator;

    public CreateUserKeyResultCommandHandler(
        UserKeyResultRepository userKeyResultRepository,
        UserObjectiveRepository userObjectiveRepository,
        UserModuleInterface userModule,
        EntityNumberGenerator numberGenerator
    ) {
        this.userKeyResultRepository = userKeyResultRepository;
        this.userObjectiveRepository = userObjectiveRepository;
        this.userModule = userModule;
        this.numberGenerator = numberGenerator;
    }

    @Transactional
    public UserKeyResultResult handle(CreateUserKeyResultCommand command) {
        // Validate user exists
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        // Validate user objective exists and belongs to user
        UserObjective userObjective = userObjectiveRepository.findById(command.userObjectiveId())
            .orElseThrow(() -> new IllegalArgumentException("User objective not found: " + command.userObjectiveId()));

        if (!userObjective.getUserId().equals(command.userId())) {
            throw new IllegalArgumentException("User objective does not belong to user: " + command.userId());
        }

        // Create user key result (domain factory method validates)
        UserKeyResult userKeyResult = UserKeyResult.create(
            command.userId(),
            command.userObjectiveId(),
            command.title()
        );

        // Set optional fields
        if (command.description() != null) {
            userKeyResult.updateDescription(command.description());
        }
        if (command.targetValue() != null) {
            userKeyResult.setTarget(command.targetValue(), command.unit());
        }

        // Generate unique number
        String number = numberGenerator.generateNextNumber(EntityType.USER_KEY_RESULT);
        userKeyResult.setNumber(number);

        // Save user key result
        UserKeyResult savedUserKeyResult = userKeyResultRepository.save(userKeyResult);

        // Return result
        return UserKeyResultResult.from(savedUserKeyResult);
    }
}
