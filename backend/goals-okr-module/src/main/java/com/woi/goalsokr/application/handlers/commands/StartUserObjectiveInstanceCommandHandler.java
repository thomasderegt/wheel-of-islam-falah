package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.StartUserObjectiveInstanceCommand;
import com.woi.goalsokr.application.results.UserObjectiveInstanceResult;
import com.woi.goalsokr.domain.entities.UserObjectiveInstance;
import com.woi.goalsokr.domain.enums.EntityType;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import com.woi.goalsokr.domain.services.EntityNumberGenerator;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for starting a new user objective instance
 */
@Component
public class StartUserObjectiveInstanceCommandHandler {
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;
    private final ObjectiveRepository objectiveRepository;
    private final UserGoalInstanceRepository userGoalInstanceRepository;
    private final UserModuleInterface userModule;
    private final EntityNumberGenerator numberGenerator;

    public StartUserObjectiveInstanceCommandHandler(
            UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            ObjectiveRepository objectiveRepository,
            UserGoalInstanceRepository userGoalInstanceRepository,
            UserModuleInterface userModule,
            EntityNumberGenerator numberGenerator) {
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.objectiveRepository = objectiveRepository;
        this.userGoalInstanceRepository = userGoalInstanceRepository;
        this.userModule = userModule;
        this.numberGenerator = numberGenerator;
    }

    @Transactional
    public UserObjectiveInstanceResult handle(StartUserObjectiveInstanceCommand command) {
        // Validate user exists
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        // Validate objective exists
        objectiveRepository.findById(command.objectiveId())
            .orElseThrow(() -> new IllegalArgumentException("Objective not found: " + command.objectiveId()));

        // Validate user goal instance exists and belongs to user
        var userGoalInstance = userGoalInstanceRepository.findById(command.userGoalInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User goal instance not found: " + command.userGoalInstanceId()));

        if (!userGoalInstance.getUserId().equals(command.userId())) {
            throw new IllegalArgumentException("User goal instance does not belong to user: " + command.userId());
        }

        // Check if instance already exists
        var existingInstance = userObjectiveInstanceRepository.findByUserGoalInstanceIdAndObjectiveId(
            command.userGoalInstanceId(), command.objectiveId());
        
        if (existingInstance.isPresent()) {
            // Return existing instance
            return UserObjectiveInstanceResult.from(existingInstance.get());
        }

        // Create new instance (domain factory method validates - userId removed)
        UserObjectiveInstance instance = UserObjectiveInstance.start(
            command.userGoalInstanceId(),
            command.objectiveId()
        );

        // Generate unique number
        String number = numberGenerator.generateNextNumber(EntityType.USER_OBJECTIVE_INSTANCE);
        instance.setNumber(number);

        // Save instance
        UserObjectiveInstance savedInstance = userObjectiveInstanceRepository.save(instance);

        // Return result
        return UserObjectiveInstanceResult.from(savedInstance);
    }
}
