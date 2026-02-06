package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CreateKeyResultCommand;
import com.woi.goalsokr.application.results.KeyResultResult;
import com.woi.goalsokr.domain.entities.KeyResult;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a new key result
 */
@Component
public class CreateKeyResultCommandHandler {
    private final KeyResultRepository keyResultRepository;
    private final ObjectiveRepository objectiveRepository;

    public CreateKeyResultCommandHandler(
            KeyResultRepository keyResultRepository,
            ObjectiveRepository objectiveRepository) {
        this.keyResultRepository = keyResultRepository;
        this.objectiveRepository = objectiveRepository;
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

        // Save key result
        KeyResult savedKeyResult = keyResultRepository.save(keyResult);

        // Return result
        return KeyResultResult.from(savedKeyResult);
    }
}
