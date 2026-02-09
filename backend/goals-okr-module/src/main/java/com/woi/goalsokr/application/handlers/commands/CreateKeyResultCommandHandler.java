package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CreateKeyResultCommand;
import com.woi.goalsokr.application.results.KeyResultResult;
import com.woi.goalsokr.domain.entities.KeyResult;
import com.woi.goalsokr.domain.enums.EntityType;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
import com.woi.goalsokr.domain.services.EntityNumberGenerator;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a new key result
 */
@Component
public class CreateKeyResultCommandHandler {
    private final KeyResultRepository keyResultRepository;
    private final ObjectiveRepository objectiveRepository;
    private final EntityNumberGenerator numberGenerator;

    public CreateKeyResultCommandHandler(
            KeyResultRepository keyResultRepository,
            ObjectiveRepository objectiveRepository,
            EntityNumberGenerator numberGenerator) {
        this.keyResultRepository = keyResultRepository;
        this.objectiveRepository = objectiveRepository;
        this.numberGenerator = numberGenerator;
    }

    @Transactional
    public KeyResultResult handle(CreateKeyResultCommand command) {
        // Validate objective exists
        objectiveRepository.findById(command.objectiveId())
            .orElseThrow(() -> new IllegalArgumentException("Objective not found: " + command.objectiveId()));

        // Create key result (domain factory method validates)
        KeyResult keyResult = KeyResult.create(
            command.objectiveId(),
            command.titleNl(),
            command.titleEn(),
            command.targetValue(),
            command.unit(),
            command.orderIndex()
        );

        // Set optional fields
        if (command.descriptionNl() != null) {
            keyResult.setDescriptionNl(command.descriptionNl());
        }
        if (command.descriptionEn() != null) {
            keyResult.setDescriptionEn(command.descriptionEn());
        }

        // Generate unique number
        String number = numberGenerator.generateNextNumber(EntityType.KEY_RESULT);
        keyResult.setNumber(number);

        // Save key result
        KeyResult savedKeyResult = keyResultRepository.save(keyResult);

        // Return result
        return KeyResultResult.from(savedKeyResult);
    }
}
