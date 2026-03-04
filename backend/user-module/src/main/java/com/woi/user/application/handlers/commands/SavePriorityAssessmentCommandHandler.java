package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.SavePriorityAssessmentCommand;
import com.woi.user.application.results.PriorityAssessmentResult;
import com.woi.user.domain.entities.PriorityAssessment;
import com.woi.user.domain.repositories.PriorityAssessmentRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class SavePriorityAssessmentCommandHandler {
    private final PriorityAssessmentRepository repository;

    public SavePriorityAssessmentCommandHandler(PriorityAssessmentRepository repository) {
        this.repository = repository;
    }

    public PriorityAssessmentResult handle(SavePriorityAssessmentCommand command) {
        Optional<PriorityAssessment> existing = command.falahCycleId() != null
            ? repository.findByUserIdAndFalahCycleId(command.userId(), command.falahCycleId())
            : repository.findByUserIdAndFalahCycleIdIsNull(command.userId());

        PriorityAssessment assessment;
        if (existing.isPresent()) {
            assessment = existing.get();
            assessment.setScores(command.scores());
            assessment.setSkippedWheels(command.skippedWheels());
            assessment.setUpdatedAt(LocalDateTime.now());
        } else {
            assessment = new PriorityAssessment();
            assessment.setUserId(command.userId());
            assessment.setFalahCycleId(command.falahCycleId());
            assessment.setScores(command.scores());
            assessment.setSkippedWheels(command.skippedWheels());
            LocalDateTime now = LocalDateTime.now();
            assessment.setCreatedAt(now);
            assessment.setUpdatedAt(now);
        }

        PriorityAssessment saved = repository.save(assessment);
        return PriorityAssessmentResult.from(saved);
    }
}
