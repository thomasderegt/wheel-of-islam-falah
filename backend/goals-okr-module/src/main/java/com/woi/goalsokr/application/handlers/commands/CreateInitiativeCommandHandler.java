package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CreateInitiativeCommand;
import com.woi.goalsokr.application.results.InitiativeResult;
import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a new initiative
 */
@Component
public class CreateInitiativeCommandHandler {
    private final InitiativeRepository initiativeRepository;
    private final KeyResultRepository keyResultRepository;
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;
    private final UserGoalInstanceRepository userGoalInstanceRepository;
    private final UserModuleInterface userModule;

    public CreateInitiativeCommandHandler(
            InitiativeRepository initiativeRepository,
            KeyResultRepository keyResultRepository,
            UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            UserGoalInstanceRepository userGoalInstanceRepository,
            UserModuleInterface userModule) {
        this.initiativeRepository = initiativeRepository;
        this.keyResultRepository = keyResultRepository;
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.userGoalInstanceRepository = userGoalInstanceRepository;
        this.userModule = userModule;
    }

    @Transactional
    public InitiativeResult handle(CreateInitiativeCommand command) {
        // Validate user exists
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        // Validate key result exists
        keyResultRepository.findById(command.keyResultId())
            .orElseThrow(() -> new IllegalArgumentException("Key result not found: " + command.keyResultId()));

        // Validate user objective instance exists and belongs to user (via UserGoalInstance)
        var userInstance = userObjectiveInstanceRepository.findById(command.userObjectiveInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User objective instance not found: " + command.userObjectiveInstanceId()));

        // Validate user goal instance exists and belongs to user
        var userGoalInstance = userGoalInstanceRepository.findById(userInstance.getUserGoalInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User goal instance not found: " + userInstance.getUserGoalInstanceId()));

        if (!userGoalInstance.getUserId().equals(command.userId())) {
            throw new IllegalArgumentException("User objective instance does not belong to user: " + command.userId());
        }

        // Create initiative (domain factory method validates - userId removed)
        Initiative initiative = Initiative.create(
            command.keyResultId(),
            command.userObjectiveInstanceId(),
            command.title()
        );

        // Set optional fields
        if (command.description() != null) {
            initiative.updateDescription(command.description());
        }
        if (command.targetDate() != null) {
            initiative.updateTargetDate(command.targetDate());
        }
        if (command.learningFlowEnrollmentId() != null) {
            initiative.linkLearningFlowEnrollment(command.learningFlowEnrollmentId());
        }

        // Save initiative
        Initiative savedInitiative = initiativeRepository.save(initiative);

        // Return result
        return InitiativeResult.from(savedInitiative);
    }
}
