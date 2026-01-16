package com.woi.learning.application.handlers.commands;

import com.woi.learning.application.commands.UpdateProgressCommand;
import com.woi.learning.application.results.EnrollmentStepProgressResult;
import com.woi.learning.domain.entities.LearningFlowEnrollmentStepProgress;
import com.woi.learning.domain.enums.ProgressStatus;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentStepProgressRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for updating progress for a learning flow step
 */
@Component
public class UpdateProgressCommandHandler {
    private final LearningFlowEnrollmentStepProgressRepository progressRepository;
    
    public UpdateProgressCommandHandler(LearningFlowEnrollmentStepProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }
    
    @Transactional
    public EnrollmentStepProgressResult handle(UpdateProgressCommand command) {
        // Find or create progress
        LearningFlowEnrollmentStepProgress progress = progressRepository
            .findByEnrollmentIdAndStepId(command.enrollmentId(), command.stepId())
            .orElseGet(() -> {
                LearningFlowEnrollmentStepProgress newProgress = 
                    LearningFlowEnrollmentStepProgress.create(command.enrollmentId(), command.stepId());
                return progressRepository.save(newProgress);
            });
        
        // Update status based on command
        if (command.status() == ProgressStatus.IN_PROGRESS) {
            progress.markInProgress();
        } else if (command.status() == ProgressStatus.COMPLETED) {
            progress.markCompleted();
        } else if (command.status() == ProgressStatus.NOT_STARTED) {
            // Reset to NOT_STARTED (create new instance)
            progress = LearningFlowEnrollmentStepProgress.create(command.enrollmentId(), command.stepId());
        }
        
        // Save progress
        LearningFlowEnrollmentStepProgress savedProgress = progressRepository.save(progress);
        
        // Return result
        return EnrollmentStepProgressResult.from(savedProgress);
    }
}

