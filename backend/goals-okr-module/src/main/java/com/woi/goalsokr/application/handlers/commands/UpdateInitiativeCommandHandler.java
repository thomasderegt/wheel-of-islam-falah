package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.UpdateInitiativeCommand;
import com.woi.goalsokr.application.results.UserInitiativeResult;
import com.woi.goalsokr.domain.entities.UserInitiative;
import com.woi.goalsokr.domain.repositories.UserInitiativeRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for updating a user initiative
 */
@Component
public class UpdateInitiativeCommandHandler {
    private final UserInitiativeRepository userInitiativeRepository;

    public UpdateInitiativeCommandHandler(UserInitiativeRepository userInitiativeRepository) {
        this.userInitiativeRepository = userInitiativeRepository;
    }

    @Transactional
    public UserInitiativeResult handle(UpdateInitiativeCommand command) {
        // Find user initiative
        UserInitiative initiative = userInitiativeRepository.findById(command.initiativeId())
            .orElseThrow(() -> new IllegalArgumentException("User initiative not found: " + command.initiativeId()));

        // Update fields if provided
        if (command.title() != null) {
            initiative.updateTitle(command.title());
        }
        if (command.description() != null) {
            initiative.updateDescription(command.description());
        }
        if (command.targetDate() != null) {
            initiative.updateTargetDate(command.targetDate());
        }
        if (command.learningFlowEnrollmentId() != null) {
            initiative.linkLearningFlowEnrollment(command.learningFlowEnrollmentId());
        } else if (command.learningFlowEnrollmentId() == null && initiative.getLearningFlowEnrollmentId() != null) {
            // Allow unsetting by passing null explicitly (not implemented in command, but could be)
            // For now, we only set if provided
        }

        // Save initiative
        UserInitiative savedInitiative = userInitiativeRepository.save(initiative);

        // Return result
        return UserInitiativeResult.from(savedInitiative);
    }
}
