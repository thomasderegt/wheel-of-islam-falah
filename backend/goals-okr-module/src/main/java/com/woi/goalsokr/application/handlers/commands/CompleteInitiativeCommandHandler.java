package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CompleteInitiativeCommand;
import com.woi.goalsokr.application.results.UserInitiativeResult;
import com.woi.goalsokr.domain.entities.UserInitiative;
import com.woi.goalsokr.domain.repositories.UserInitiativeRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for completing a user initiative
 */
@Component
public class CompleteInitiativeCommandHandler {
    private final UserInitiativeRepository userInitiativeRepository;

    public CompleteInitiativeCommandHandler(UserInitiativeRepository userInitiativeRepository) {
        this.userInitiativeRepository = userInitiativeRepository;
    }

    @Transactional
    public UserInitiativeResult handle(CompleteInitiativeCommand command) {
        // Find user initiative
        UserInitiative initiative = userInitiativeRepository.findById(command.initiativeId())
            .orElseThrow(() -> new IllegalArgumentException("User initiative not found: " + command.initiativeId()));

        // Complete initiative
        initiative.complete();

        // Save initiative
        UserInitiative savedInitiative = userInitiativeRepository.save(initiative);

        // Return result
        return UserInitiativeResult.from(savedInitiative);
    }
}
