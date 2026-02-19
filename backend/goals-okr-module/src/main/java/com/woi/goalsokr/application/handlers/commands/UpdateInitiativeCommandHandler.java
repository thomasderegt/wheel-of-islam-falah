package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.UpdateInitiativeCommand;
import com.woi.goalsokr.application.results.UserInitiativeResult;
import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for updating a custom initiative (created_by_user_id not null)
 */
@Component
public class UpdateInitiativeCommandHandler {
    private final InitiativeRepository initiativeRepository;
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;

    public UpdateInitiativeCommandHandler(
            InitiativeRepository initiativeRepository,
            UserInitiativeInstanceRepository userInitiativeInstanceRepository) {
        this.initiativeRepository = initiativeRepository;
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
    }

    @Transactional
    public UserInitiativeResult handle(UpdateInitiativeCommand command) {
        Initiative initiative = initiativeRepository.findById(command.initiativeId())
            .orElseThrow(() -> new IllegalArgumentException("Initiative not found: " + command.initiativeId()));

        if (initiative.getCreatedByUserId() == null) {
            throw new IllegalArgumentException("Cannot update template initiative");
        }

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
        }

        Initiative savedInitiative = initiativeRepository.save(initiative);

        var instances = userInitiativeInstanceRepository.findByInitiativeId(savedInitiative.getId());
        Long instanceId = instances.isEmpty() ? null : instances.get(0).getId();
        Long userKeyResultInstanceId = instances.isEmpty() ? null : instances.get(0).getUserKeyResultInstanceId();
        return UserInitiativeResult.from(savedInitiative, userKeyResultInstanceId, savedInitiative.getCreatedByUserId(), instanceId);
    }
}
