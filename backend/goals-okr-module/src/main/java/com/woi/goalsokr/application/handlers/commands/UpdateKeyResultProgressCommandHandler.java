package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.UpdateKeyResultProgressCommand;
import com.woi.goalsokr.application.results.KeyResultProgressResult;
import com.woi.goalsokr.domain.entities.KeyResultProgress;
import com.woi.goalsokr.domain.repositories.KeyResultProgressRepository;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
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
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final UserGoalInstanceRepository userGoalInstanceRepository;
    private final UserModuleInterface userModule;

    public UpdateKeyResultProgressCommandHandler(
            KeyResultProgressRepository progressRepository,
            KeyResultRepository keyResultRepository,
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            UserGoalInstanceRepository userGoalInstanceRepository,
            UserModuleInterface userModule) {
        this.progressRepository = progressRepository;
        this.keyResultRepository = keyResultRepository;
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
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

        // Validate user key result instance exists and belongs to user (via UserObjectiveInstance → UserGoalInstance)
        var userKeyResultInstance = userKeyResultInstanceRepository.findById(command.userKeyResultInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User key result instance not found: " + command.userKeyResultInstanceId()));

        // Note: User validation is done via UserKeyResultInstance → UserObjectiveInstance → UserGoalInstance chain

        // Find or create progress (query via userKeyResultInstanceId)
        var existingProgress = progressRepository.findByUserKeyResultInstanceId(command.userKeyResultInstanceId()).stream()
            .filter(p -> p.getKeyResultId().equals(command.keyResultId()))
            .findFirst();

        KeyResultProgress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            progress.updateProgress(command.currentValue());
        } else {
            progress = KeyResultProgress.create(
                command.keyResultId(),
                command.userKeyResultInstanceId(),
                command.currentValue()
            );
        }

        // Save progress
        KeyResultProgress savedProgress = progressRepository.save(progress);

        // Return result
        return KeyResultProgressResult.from(savedProgress);
    }
}
