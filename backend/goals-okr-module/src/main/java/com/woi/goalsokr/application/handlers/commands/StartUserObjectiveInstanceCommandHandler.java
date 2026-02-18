package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.StartUserObjectiveInstanceCommand;
import com.woi.goalsokr.application.results.UserObjectiveInstanceResult;
import com.woi.goalsokr.domain.entities.UserObjectiveInstance;
import com.woi.goalsokr.domain.enums.EntityType;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
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
    private final UserModuleInterface userModule;
    private final EntityNumberGenerator numberGenerator;

    public StartUserObjectiveInstanceCommandHandler(
            UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            ObjectiveRepository objectiveRepository,
            UserModuleInterface userModule,
            EntityNumberGenerator numberGenerator) {
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.objectiveRepository = objectiveRepository;
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

        // Check if instance already exists
        var existingInstance = userObjectiveInstanceRepository.findByUserIdAndObjectiveId(
            command.userId(), command.objectiveId());
        
        if (existingInstance.isPresent()) {
            return UserObjectiveInstanceResult.from(existingInstance.get());
        }

        // Create new instance
        UserObjectiveInstance instance = UserObjectiveInstance.start(
            command.userId(),
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
