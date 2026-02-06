package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CompleteUserGoalInstanceCommand;
import com.woi.goalsokr.application.results.UserGoalInstanceResult;
import com.woi.goalsokr.domain.entities.UserGoalInstance;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for completing a user goal instance
 */
@Component
public class CompleteUserGoalInstanceCommandHandler {
    private final UserGoalInstanceRepository userGoalInstanceRepository;

    public CompleteUserGoalInstanceCommandHandler(UserGoalInstanceRepository userGoalInstanceRepository) {
        this.userGoalInstanceRepository = userGoalInstanceRepository;
    }

    @Transactional
    public UserGoalInstanceResult handle(CompleteUserGoalInstanceCommand command) {
        // Find instance
        UserGoalInstance instance = userGoalInstanceRepository.findById(command.userGoalInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User goal instance not found: " + command.userGoalInstanceId()));

        // Complete instance
        instance.complete();

        // Save instance
        UserGoalInstance savedInstance = userGoalInstanceRepository.save(instance);

        // Return result
        return UserGoalInstanceResult.from(savedInstance);
    }
}
