package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.UpdateGoalCommand;
import com.woi.goalsokr.application.results.GoalResult;
import com.woi.goalsokr.domain.entities.Goal;
import com.woi.goalsokr.domain.repositories.GoalRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Command handler for updating an existing goal
 */
@Component
public class UpdateGoalCommandHandler {
    private final GoalRepository goalRepository;

    public UpdateGoalCommandHandler(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    @Transactional
    public GoalResult handle(UpdateGoalCommand command) {
        Goal goal = goalRepository.findById(command.goalId())
            .orElseThrow(() -> new IllegalArgumentException("Goal not found: " + command.goalId()));

        // Update fields (only if provided)
        if (command.titleNl() != null) {
            goal.setTitleNl(command.titleNl());
        }
        if (command.titleEn() != null) {
            goal.setTitleEn(command.titleEn());
        }
        if (command.descriptionNl() != null) {
            goal.setDescriptionNl(command.descriptionNl());
        }
        if (command.descriptionEn() != null) {
            goal.setDescriptionEn(command.descriptionEn());
        }
        if (command.quarter() != null) {
            goal.setQuarter(command.quarter());
        }
        if (command.year() != null) {
            goal.setYear(command.year());
        }

        goal.setUpdatedAt(LocalDateTime.now());
        
        Goal savedGoal = goalRepository.save(goal);
        return GoalResult.from(savedGoal);
    }
}
