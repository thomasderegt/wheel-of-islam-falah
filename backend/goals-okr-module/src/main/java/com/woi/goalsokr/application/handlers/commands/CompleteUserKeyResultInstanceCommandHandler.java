package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CompleteUserKeyResultInstanceCommand;
import com.woi.goalsokr.application.results.UserKeyResultInstanceResult;
import com.woi.goalsokr.domain.entities.UserKeyResultInstance;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for completing a user key result instance
 */
@Component
public class CompleteUserKeyResultInstanceCommandHandler {
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;

    public CompleteUserKeyResultInstanceCommandHandler(UserKeyResultInstanceRepository userKeyResultInstanceRepository) {
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
    }

    @Transactional
    public UserKeyResultInstanceResult handle(CompleteUserKeyResultInstanceCommand command) {
        // Find instance
        UserKeyResultInstance instance = userKeyResultInstanceRepository.findById(command.userKeyResultInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User key result instance not found: " + command.userKeyResultInstanceId()));

        // Complete instance
        instance.complete();

        // Save instance
        UserKeyResultInstance savedInstance = userKeyResultInstanceRepository.save(instance);

        // Return result
        return UserKeyResultInstanceResult.from(savedInstance);
    }
}
