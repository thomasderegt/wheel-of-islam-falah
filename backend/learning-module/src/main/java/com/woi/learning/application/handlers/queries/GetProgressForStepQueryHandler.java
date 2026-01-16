package com.woi.learning.application.handlers.queries;

import com.woi.learning.application.queries.GetProgressForStepQuery;
import com.woi.learning.application.results.EnrollmentStepProgressResult;
import com.woi.learning.domain.entities.LearningFlowEnrollmentStepProgress;
import com.woi.learning.domain.enums.ProgressStatus;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentStepProgressRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Query handler for getting progress for a specific step
 */
@Component
public class GetProgressForStepQueryHandler {
    private final LearningFlowEnrollmentStepProgressRepository progressRepository;
    
    public GetProgressForStepQueryHandler(LearningFlowEnrollmentStepProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }
    
    @Transactional(readOnly = true)
    public EnrollmentStepProgressResult handle(GetProgressForStepQuery query) {
        return progressRepository.findByEnrollmentIdAndStepId(query.enrollmentId(), query.stepId())
            .map(EnrollmentStepProgressResult::from)
            .orElseGet(() -> {
                // Return NOT_STARTED if progress doesn't exist
                LearningFlowEnrollmentStepProgress defaultProgress = 
                    LearningFlowEnrollmentStepProgress.create(query.enrollmentId(), query.stepId());
                return EnrollmentStepProgressResult.from(defaultProgress);
            });
    }
}

