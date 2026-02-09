package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CreateInitiativeCommand;
import com.woi.goalsokr.application.results.UserInitiativeResult;
import com.woi.goalsokr.domain.entities.UserInitiative;
import com.woi.goalsokr.domain.enums.EntityType;
import com.woi.goalsokr.domain.repositories.UserInitiativeRepository;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import com.woi.goalsokr.domain.entities.UserInitiativeInstance;
import com.woi.goalsokr.domain.services.EntityNumberGenerator;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a new user initiative
 */
@Component
public class CreateInitiativeCommandHandler {
    private final UserInitiativeRepository userInitiativeRepository;
    private final KeyResultRepository keyResultRepository;
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;
    private final UserModuleInterface userModule;
    private final EntityNumberGenerator numberGenerator;

    public CreateInitiativeCommandHandler(
            UserInitiativeRepository userInitiativeRepository,
            KeyResultRepository keyResultRepository,
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            UserInitiativeInstanceRepository userInitiativeInstanceRepository,
            UserModuleInterface userModule,
            EntityNumberGenerator numberGenerator) {
        this.userInitiativeRepository = userInitiativeRepository;
        this.keyResultRepository = keyResultRepository;
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
        this.userModule = userModule;
        this.numberGenerator = numberGenerator;
    }

    @Transactional
    public UserInitiativeResult handle(CreateInitiativeCommand command) {
        // Validate user exists
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        // Validate key result exists (optional, for template reference)
        if (command.keyResultId() != null) {
            keyResultRepository.findById(command.keyResultId())
                .orElseThrow(() -> new IllegalArgumentException("Key result not found: " + command.keyResultId()));
        }

        // Validate user key result instance exists and belongs to user
        var userKeyResultInstance = userKeyResultInstanceRepository.findById(command.userKeyResultInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User key result instance not found: " + command.userKeyResultInstanceId()));

        // Create user initiative
        UserInitiative initiative = UserInitiative.create(
            command.userId(),
            command.userKeyResultInstanceId(),
            command.title()
        );
        
        // Set optional fields
        if (command.description() != null) {
            initiative.updateDescription(command.description());
        }
        if (command.targetDate() != null) {
            initiative.updateTargetDate(command.targetDate());
        }
        
        // Generate unique number
        String number = numberGenerator.generateNextNumber(EntityType.USER_INITIATIVE);
        initiative.setNumber(number);
        
        // Save initiative first to get ID
        UserInitiative savedInitiative = userInitiativeRepository.save(initiative);
        
        // Set keyResultId if provided (using setter for infrastructure layer)
        if (command.keyResultId() != null) {
            savedInitiative.setKeyResultId(command.keyResultId());
            savedInitiative = userInitiativeRepository.save(savedInitiative);
        }
        
        // Create UserInitiativeInstance (subscription to the initiative)
        UserInitiativeInstance instance = UserInitiativeInstance.start(
            command.userKeyResultInstanceId(),
            savedInitiative.getId()
        );
        
        // Save instance
        userInitiativeInstanceRepository.save(instance);
        
        // Link learning flow enrollment if provided
        if (command.learningFlowEnrollmentId() != null) {
            savedInitiative.linkLearningFlowEnrollment(command.learningFlowEnrollmentId());
            savedInitiative = userInitiativeRepository.save(savedInitiative);
        }

        // Return result
        return UserInitiativeResult.from(savedInitiative);
    }
}
