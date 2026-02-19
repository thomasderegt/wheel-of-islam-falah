package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.AddKanbanItemCommand;
import com.woi.goalsokr.application.commands.CreateInitiativeCommand;
import com.woi.goalsokr.application.results.UserInitiativeResult;
import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.entities.UserInitiativeInstance;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import com.woi.goalsokr.domain.services.EntityNumberGenerator;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a custom initiative.
 * Creates an Initiative in initiatives table (with created_by_user_id) + UserInitiativeInstance + Kanban item.
 */
@Component
public class CreateInitiativeCommandHandler {
    private final InitiativeRepository initiativeRepository;
    private final KeyResultRepository keyResultRepository;
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;
    private final AddKanbanItemCommandHandler addKanbanItemHandler;
    private final UserModuleInterface userModule;
    private final EntityNumberGenerator numberGenerator;

    public CreateInitiativeCommandHandler(
            InitiativeRepository initiativeRepository,
            KeyResultRepository keyResultRepository,
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            UserInitiativeInstanceRepository userInitiativeInstanceRepository,
            AddKanbanItemCommandHandler addKanbanItemHandler,
            UserModuleInterface userModule,
            EntityNumberGenerator numberGenerator) {
        this.initiativeRepository = initiativeRepository;
        this.keyResultRepository = keyResultRepository;
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
        this.addKanbanItemHandler = addKanbanItemHandler;
        this.userModule = userModule;
        this.numberGenerator = numberGenerator;
    }

    @Transactional
    public UserInitiativeResult handle(CreateInitiativeCommand command) {
        // Validate user exists
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }

        // Validate user key result instance exists and get key_result_id
        var userKeyResultInstance = userKeyResultInstanceRepository.findById(command.userKeyResultInstanceId())
            .orElseThrow(() -> new IllegalArgumentException("User key result instance not found: " + command.userKeyResultInstanceId()));

        Long keyResultId = command.keyResultId() != null ? command.keyResultId() : userKeyResultInstance.getKeyResultId();
        if (keyResultId == null) {
            throw new IllegalArgumentException("Key result ID is required");
        }

        // Validate key result exists
        keyResultRepository.findById(keyResultId)
            .orElseThrow(() -> new IllegalArgumentException("Key result not found: " + keyResultId));

        // Calculate display order
        var existingInitiatives = initiativeRepository.findByKeyResultId(keyResultId);
        int displayOrder = existingInitiatives.size() + 1;

        // Create Initiative (custom - in initiatives table with created_by_user_id)
        Initiative initiative = Initiative.createCustom(
            keyResultId,
            command.userId(),
            command.title(),
            command.description(),
            command.targetDate(),
            displayOrder
        );
        initiative.setNumber(numberGenerator.generateNextNumber(com.woi.goalsokr.domain.enums.EntityType.INITIATIVE));
        Initiative savedInitiative = initiativeRepository.save(initiative);

        // Create UserInitiativeInstance
        UserInitiativeInstance instance = UserInitiativeInstance.start(
            command.userKeyResultInstanceId(),
            savedInitiative.getId()
        );
        UserInitiativeInstance savedInstance = userInitiativeInstanceRepository.save(instance);

        // Add to kanban board
        try {
            addKanbanItemHandler.handle(new AddKanbanItemCommand(
                command.userId(),
                "INITIATIVE",
                savedInstance.getId()
            ));
        } catch (IllegalArgumentException e) {
            if (!"Item already exists in kanban board".equals(e.getMessage())) {
                throw e;
            }
        }

        // Link learning flow enrollment if provided
        if (command.learningFlowEnrollmentId() != null) {
            savedInitiative.linkLearningFlowEnrollment(command.learningFlowEnrollmentId());
            savedInitiative = initiativeRepository.save(savedInitiative);
        }

        return UserInitiativeResult.from(savedInitiative, command.userKeyResultInstanceId(), command.userId(), savedInstance.getId());
    }
}
