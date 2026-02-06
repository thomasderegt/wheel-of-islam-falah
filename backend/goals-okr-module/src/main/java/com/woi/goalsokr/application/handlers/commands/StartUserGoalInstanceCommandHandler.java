package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.StartUserGoalInstanceCommand;
import com.woi.goalsokr.application.results.UserGoalInstanceResult;
import com.woi.goalsokr.domain.entities.UserGoalInstance;
import com.woi.goalsokr.domain.repositories.GoalRepository;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for starting a new user goal instance (subscription/enrollment)
 */
@Component
public class StartUserGoalInstanceCommandHandler {
    private final UserGoalInstanceRepository userGoalInstanceRepository;
    private final GoalRepository goalRepository;

    public StartUserGoalInstanceCommandHandler(
            UserGoalInstanceRepository userGoalInstanceRepository,
            GoalRepository goalRepository) {
        this.userGoalInstanceRepository = userGoalInstanceRepository;
        this.goalRepository = goalRepository;
    }

    @Transactional
    public UserGoalInstanceResult handle(StartUserGoalInstanceCommand command) {
        // Validate goal exists
        goalRepository.findById(command.goalId())
            .orElseThrow(() -> new IllegalArgumentException("Goal not found: " + command.goalId()));

        // Check if instance already exists (one subscription per user per goal)
        var existingInstance = userGoalInstanceRepository.findByUserIdAndGoalId(
            command.userId(), command.goalId());
        
        if (existingInstance.isPresent()) {
            // Return existing instance
            return UserGoalInstanceResult.from(existingInstance.get());
        }

        // Create new instance (domain factory method validates)
        UserGoalInstance instance = UserGoalInstance.start(
            command.userId(),
            command.goalId()
        );

        // Save instance
        UserGoalInstance savedInstance = userGoalInstanceRepository.save(instance);

        // Return result
        return UserGoalInstanceResult.from(savedInstance);
    }
}
