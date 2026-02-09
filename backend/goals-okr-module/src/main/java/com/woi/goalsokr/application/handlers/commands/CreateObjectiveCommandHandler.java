package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CreateObjectiveCommand;
import com.woi.goalsokr.application.results.ObjectiveResult;
import com.woi.goalsokr.domain.entities.Objective;
import com.woi.goalsokr.domain.enums.EntityType;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
import com.woi.goalsokr.domain.services.EntityNumberGenerator;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a new objective
 */
@Component
public class CreateObjectiveCommandHandler {
    private final ObjectiveRepository objectiveRepository;
    private final EntityNumberGenerator numberGenerator;

    public CreateObjectiveCommandHandler(
            ObjectiveRepository objectiveRepository,
            EntityNumberGenerator numberGenerator) {
        this.objectiveRepository = objectiveRepository;
        this.numberGenerator = numberGenerator;
    }

    @Transactional
    public ObjectiveResult handle(CreateObjectiveCommand command) {
        // Create objective (domain factory method validates)
        Objective objective = Objective.create(
            command.goalId(),
            command.titleNl(),
            command.titleEn(),
            command.orderIndex()
        );

        // Set optional fields
        if (command.descriptionNl() != null) {
            objective.setDescriptionNl(command.descriptionNl());
        }
        if (command.descriptionEn() != null) {
            objective.setDescriptionEn(command.descriptionEn());
        }

        // Generate unique number
        String number = numberGenerator.generateNextNumber(EntityType.OBJECTIVE);
        objective.setNumber(number);

        // Save objective
        Objective savedObjective = objectiveRepository.save(objective);

        // Return result
        return ObjectiveResult.from(savedObjective);
    }
}
