package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CompleteUserInitiativeInstanceCommand;
import com.woi.goalsokr.application.results.UserInitiativeInstanceResult;
import com.woi.goalsokr.domain.entities.UserInitiativeInstance;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for completing a user initiative instance
 */
@Component
public class CompleteUserInitiativeInstanceCommandHandler {
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;

    public CompleteUserInitiativeInstanceCommandHandler(UserInitiativeInstanceRepository userInitiativeInstanceRepository) {
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
    }

    @Transactional
    public UserInitiativeInstanceResult handle(CompleteUserInitiativeInstanceCommand command) {
        // Find instance
        UserInitiativeInstance instance = userInitiativeInstanceRepository.findById(command.userInitiativeInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User initiative instance not found: " + command.userInitiativeInstanceId()));

        // Complete instance
        instance.complete();

        // Save instance
        UserInitiativeInstance savedInstance = userInitiativeInstanceRepository.save(instance);

        // Return result
        return UserInitiativeInstanceResult.from(savedInstance);
    }
}
