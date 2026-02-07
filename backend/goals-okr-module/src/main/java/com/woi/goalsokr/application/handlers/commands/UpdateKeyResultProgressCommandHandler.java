package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.UpdateKeyResultProgressCommand;
import com.woi.goalsokr.application.results.KeyResultProgressResult;
import com.woi.goalsokr.domain.entities.KeyResultProgress;
import com.woi.goalsokr.domain.repositories.KeyResultProgressRepository;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for updating key result progress
 */
@Component
public class UpdateKeyResultProgressCommandHandler {
    private final KeyResultProgressRepository progressRepository;
    private final KeyResultRepository keyResultRepository;
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;
    private final UserGoalInstanceRepository userGoalInstanceRepository;
    private final UserModuleInterface userModule;

    public UpdateKeyResultProgressCommandHandler(
            KeyResultProgressRepository progressRepository,
            KeyResultRepository keyResultRepository,
            UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            UserGoalInstanceRepository userGoalInstanceRepository,
            UserModuleInterface userModule) {
        this.progressRepository = progressRepository;
        this.keyResultRepository = keyResultRepository;
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.userGoalInstanceRepository = userGoalInstanceRepository;
        this.userModule = userModule;
    }

    @Transactional
    public KeyResultProgressResult handle(UpdateKeyResultProgressCommand command) {
        // Validate user exists
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        // Validate key result exists
        keyResultRepository.findById(command.keyResultId())
            .orElseThrow(() -> new IllegalArgumentException("Key result not found: " + command.keyResultId()));

        // Validate user objective instance exists and belongs to user (via UserGoalInstance)
        var userInstance = userObjectiveInstanceRepository.findById(command.userObjectiveInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User objective instance not found: " + command.userObjectiveInstanceId()));

        // Validate user goal instance exists and belongs to user
        var userGoalInstance = userGoalInstanceRepository.findById(userInstance.getUserGoalInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User goal instance not found: " + userInstance.getUserGoalInstanceId()));

        if (!userGoalInstance.getUserId().equals(command.userId())) {
            throw new IllegalArgumentException("User objective instance does not belong to user: " + command.userId());
        }

        // Find or create progress (query via userObjectiveInstanceId only)
        var existingProgress = progressRepository.findByUserObjectiveInstanceId(command.userObjectiveInstanceId()).stream()
            .filter(p -> p.getKeyResultId().equals(command.keyResultId()))
            .findFirst();

        KeyResultProgress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            progress.updateProgress(command.currentValue());
        } else {
            progress = KeyResultProgress.create(
                command.keyResultId(),
                command.userObjectiveInstanceId(),
                command.currentValue()
            );
        }

        // Save progress
        KeyResultProgress savedProgress = progressRepository.save(progress);

        // Return result
        return KeyResultProgressResult.from(savedProgress);
    }
}
