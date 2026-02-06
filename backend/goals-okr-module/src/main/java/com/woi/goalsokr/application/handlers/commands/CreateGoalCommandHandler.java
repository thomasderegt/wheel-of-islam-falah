package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CreateGoalCommand;
import com.woi.goalsokr.application.results.GoalResult;
import com.woi.goalsokr.domain.entities.Goal;
import com.woi.goalsokr.domain.repositories.GoalRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a new goal
 */
@Component
public class CreateGoalCommandHandler {
    private final GoalRepository goalRepository;

    public CreateGoalCommandHandler(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    @Transactional
    public GoalResult handle(CreateGoalCommand command) {
        // Create goal (domain factory method validates)
        Goal goal = Goal.create(
            command.lifeDomainId(),
            command.titleNl(),
            command.titleEn(),
            command.orderIndex()
        );

        // Set optional fields
        if (command.descriptionNl() != null) {
            goal.setDescriptionNl(command.descriptionNl());
        }
        if (command.descriptionEn() != null) {
            goal.setDescriptionEn(command.descriptionEn());
        }

        // Save goal
        Goal savedGoal = goalRepository.save(goal);

        // Return result
        return GoalResult.from(savedGoal);
    }
}
