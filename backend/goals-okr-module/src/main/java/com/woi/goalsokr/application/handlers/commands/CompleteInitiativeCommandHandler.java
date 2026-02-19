package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CompleteInitiativeCommand;
import com.woi.goalsokr.application.results.UserInitiativeResult;
import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for completing a custom initiative (created_by_user_id not null)
 */
@Component
public class CompleteInitiativeCommandHandler {
    private final InitiativeRepository initiativeRepository;
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;

    public CompleteInitiativeCommandHandler(
            InitiativeRepository initiativeRepository,
            UserInitiativeInstanceRepository userInitiativeInstanceRepository) {
        this.initiativeRepository = initiativeRepository;
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
    }

    @Transactional
    public UserInitiativeResult handle(CompleteInitiativeCommand command) {
        Initiative initiative = initiativeRepository.findById(command.initiativeId())
            .orElseThrow(() -> new IllegalArgumentException("Initiative not found: " + command.initiativeId()));

        if (initiative.getCreatedByUserId() == null) {
            throw new IllegalArgumentException("Cannot complete template initiative");
        }

        initiative.complete();
        Initiative savedInitiative = initiativeRepository.save(initiative);

        var instances = userInitiativeInstanceRepository.findByInitiativeId(savedInitiative.getId());
        Long instanceId = instances.isEmpty() ? null : instances.get(0).getId();
        Long userKeyResultInstanceId = instances.isEmpty() ? null : instances.get(0).getUserKeyResultInstanceId();
        return UserInitiativeResult.from(savedInitiative, userKeyResultInstanceId, savedInitiative.getCreatedByUserId(), instanceId);
    }
}
