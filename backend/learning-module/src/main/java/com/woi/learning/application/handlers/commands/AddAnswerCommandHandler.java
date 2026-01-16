package com.woi.learning.application.handlers.commands;

import com.woi.learning.application.commands.AddAnswerCommand;
import com.woi.learning.application.results.EnrollmentAnswerResult;
import com.woi.learning.domain.entities.LearningFlowEnrollmentAnswer;
import com.woi.learning.domain.entities.LearningFlowEnrollmentStepProgress;
import com.woi.learning.domain.enums.ProgressStatus;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentAnswerRepository;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentStepProgressRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for adding an answer to a learning flow step
 * Automatically sets progress to IN_PROGRESS if it was NOT_STARTED
 */
@Component
public class AddAnswerCommandHandler {
    private final LearningFlowEnrollmentAnswerRepository answerRepository;
    private final LearningFlowEnrollmentStepProgressRepository progressRepository;
    
    public AddAnswerCommandHandler(
            LearningFlowEnrollmentAnswerRepository answerRepository,
            LearningFlowEnrollmentStepProgressRepository progressRepository) {
        this.answerRepository = answerRepository;
        this.progressRepository = progressRepository;
    }
    
    @Transactional
    public EnrollmentAnswerResult handle(AddAnswerCommand command) {
        // Create answer (domain factory method validates)
        LearningFlowEnrollmentAnswer answer = LearningFlowEnrollmentAnswer.create(
            command.enrollmentId(),
            command.stepId(),
            command.type(),
            command.answerText()
        );
        
        // Save answer
        LearningFlowEnrollmentAnswer savedAnswer = answerRepository.save(answer);
        
        // Auto-update progress: if progress is NOT_STARTED, set to IN_PROGRESS
        progressRepository.findByEnrollmentIdAndStepId(command.enrollmentId(), command.stepId())
            .ifPresentOrElse(
                progress -> {
                    if (progress.getStatus() == ProgressStatus.NOT_STARTED) {
                        progress.markInProgress();
                        progressRepository.save(progress);
                    }
                },
                () -> {
                    // Create new progress if it doesn't exist
                    LearningFlowEnrollmentStepProgress newProgress = 
                        LearningFlowEnrollmentStepProgress.create(command.enrollmentId(), command.stepId());
                    newProgress.markInProgress();
                    progressRepository.save(newProgress);
                }
            );
        
        // Return result
        return EnrollmentAnswerResult.from(savedAnswer);
    }
}

