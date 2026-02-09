package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.StartUserInitiativeInstanceCommand;
import com.woi.goalsokr.application.results.UserInitiativeInstanceResult;
import com.woi.goalsokr.domain.entities.UserInitiativeInstance;
import com.woi.goalsokr.domain.enums.EntityType;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import com.woi.goalsokr.domain.services.EntityNumberGenerator;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for starting a new user initiative instance
 */
@Component
public class StartUserInitiativeInstanceCommandHandler {
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;
    private final InitiativeRepository initiativeRepository;
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final UserModuleInterface userModule;
    private final EntityNumberGenerator numberGenerator;

    public StartUserInitiativeInstanceCommandHandler(
            UserInitiativeInstanceRepository userInitiativeInstanceRepository,
            InitiativeRepository initiativeRepository,
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            UserModuleInterface userModule,
            EntityNumberGenerator numberGenerator) {
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
        this.initiativeRepository = initiativeRepository;
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.userModule = userModule;
        this.numberGenerator = numberGenerator;
    }

    @Transactional
    public UserInitiativeInstanceResult handle(StartUserInitiativeInstanceCommand command) {
        // Validate user exists
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        // Validate initiative exists
        initiativeRepository.findById(command.initiativeId())
            .orElseThrow(() -> new IllegalArgumentException("Initiative not found: " + command.initiativeId()));

        // Validate user key result instance exists
        var userKeyResultInstance = userKeyResultInstanceRepository.findById(command.userKeyResultInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User key result instance not found: " + command.userKeyResultInstanceId()));

        // Check if instance already exists
        var existingInstance = userInitiativeInstanceRepository.findByUserKeyResultInstanceIdAndInitiativeId(
            command.userKeyResultInstanceId(), command.initiativeId());
        
        if (existingInstance.isPresent()) {
            // Return existing instance
            return UserInitiativeInstanceResult.from(existingInstance.get());
        }

        // Create new instance
        UserInitiativeInstance instance = UserInitiativeInstance.start(
            command.userKeyResultInstanceId(),
            command.initiativeId()
        );

        // Generate unique number
        String number = numberGenerator.generateNextNumber(EntityType.USER_INITIATIVE_INSTANCE);
        instance.setNumber(number);

        // Save instance
        UserInitiativeInstance savedInstance = userInitiativeInstanceRepository.save(instance);

        // Return result
        return UserInitiativeInstanceResult.from(savedInstance);
    }
}
