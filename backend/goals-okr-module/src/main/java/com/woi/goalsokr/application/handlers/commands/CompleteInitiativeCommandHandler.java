package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CompleteInitiativeCommand;
import com.woi.goalsokr.application.results.InitiativeResult;
import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for completing an initiative
 */
@Component
public class CompleteInitiativeCommandHandler {
    private final InitiativeRepository initiativeRepository;

    public CompleteInitiativeCommandHandler(InitiativeRepository initiativeRepository) {
        this.initiativeRepository = initiativeRepository;
    }

    @Transactional
    public InitiativeResult handle(CompleteInitiativeCommand command) {
        // Find initiative
        Initiative initiative = initiativeRepository.findById(command.initiativeId())
            .orElseThrow(() -> new IllegalArgumentException("Initiative not found: " + command.initiativeId()));

        // Complete initiative
        initiative.complete();

        // Save initiative
        Initiative savedInitiative = initiativeRepository.save(initiative);

        // Return result
        return InitiativeResult.from(savedInitiative);
    }
}
