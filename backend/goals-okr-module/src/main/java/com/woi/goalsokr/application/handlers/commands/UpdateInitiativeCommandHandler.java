package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.UpdateInitiativeCommand;
import com.woi.goalsokr.application.results.InitiativeResult;
import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for updating an initiative
 */
@Component
public class UpdateInitiativeCommandHandler {
    private final InitiativeRepository initiativeRepository;

    public UpdateInitiativeCommandHandler(InitiativeRepository initiativeRepository) {
        this.initiativeRepository = initiativeRepository;
    }

    @Transactional
    public InitiativeResult handle(UpdateInitiativeCommand command) {
        // Find initiative
        Initiative initiative = initiativeRepository.findById(command.initiativeId())
            .orElseThrow(() -> new IllegalArgumentException("Initiative not found: " + command.initiativeId()));

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

        // Save initiative
        Initiative savedInitiative = initiativeRepository.save(initiative);

        // Return result
        return InitiativeResult.from(savedInitiative);
    }
}
