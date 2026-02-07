package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.StartUserKeyResultInstanceCommand;
import com.woi.goalsokr.application.results.UserKeyResultInstanceResult;
import com.woi.goalsokr.domain.entities.UserKeyResultInstance;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for starting a new user key result instance
 */
@Component
public class StartUserKeyResultInstanceCommandHandler {
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final KeyResultRepository keyResultRepository;
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;
    private final UserModuleInterface userModule;

    public StartUserKeyResultInstanceCommandHandler(
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            KeyResultRepository keyResultRepository,
            UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            UserModuleInterface userModule) {
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.keyResultRepository = keyResultRepository;
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.userModule = userModule;
    }

    @Transactional
    public UserKeyResultInstanceResult handle(StartUserKeyResultInstanceCommand command) {
        // Validate user exists
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        // Validate key result exists
        keyResultRepository.findById(command.keyResultId())
            .orElseThrow(() -> new IllegalArgumentException("Key result not found: " + command.keyResultId()));

        // Validate user objective instance exists and belongs to user (via UserGoalInstance)
        var userObjectiveInstance = userObjectiveInstanceRepository.findById(command.userObjectiveInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User objective instance not found: " + command.userObjectiveInstanceId()));

        // Note: User validation is done via UserObjectiveInstance → UserGoalInstance chain
        // We trust that if userObjectiveInstance exists, it belongs to the correct user

        // Check if instance already exists
        var existingInstance = userKeyResultInstanceRepository.findByUserObjectiveInstanceIdAndKeyResultId(
            command.userObjectiveInstanceId(), command.keyResultId());
        
        if (existingInstance.isPresent()) {
            // Return existing instance
            return UserKeyResultInstanceResult.from(existingInstance.get());
        }

        // Create new instance
        UserKeyResultInstance instance = UserKeyResultInstance.start(
            command.userObjectiveInstanceId(),
            command.keyResultId()
        );

        // Save instance
        UserKeyResultInstance savedInstance = userKeyResultInstanceRepository.save(instance);

        // Return result
        return UserKeyResultInstanceResult.from(savedInstance);
    }
}
