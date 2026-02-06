package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CompleteUserObjectiveInstanceCommand;
import com.woi.goalsokr.application.results.UserObjectiveInstanceResult;
import com.woi.goalsokr.domain.entities.UserObjectiveInstance;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for completing a user objective instance
 */
@Component
public class CompleteUserObjectiveInstanceCommandHandler {
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;

    public CompleteUserObjectiveInstanceCommandHandler(UserObjectiveInstanceRepository userObjectiveInstanceRepository) {
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
    }

    @Transactional
    public UserObjectiveInstanceResult handle(CompleteUserObjectiveInstanceCommand command) {
        // Find instance
        UserObjectiveInstance instance = userObjectiveInstanceRepository.findById(command.userObjectiveInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User objective instance not found: " + command.userObjectiveInstanceId()));

        // Complete instance
        instance.complete();

        // Save instance
        UserObjectiveInstance savedInstance = userObjectiveInstanceRepository.save(instance);

        // Return result
        return UserObjectiveInstanceResult.from(savedInstance);
    }
}
