package com.woi.learning.application.handlers.queries;

import com.woi.learning.application.queries.GetProgressForEnrollmentQuery;
import com.woi.learning.application.results.EnrollmentStepProgressResult;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentStepProgressRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting progress for all steps in an enrollment
 */
@Component
public class GetProgressForEnrollmentQueryHandler {
    private final LearningFlowEnrollmentStepProgressRepository progressRepository;
    
    public GetProgressForEnrollmentQueryHandler(LearningFlowEnrollmentStepProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }
    
    @Transactional(readOnly = true)
    public List<EnrollmentStepProgressResult> handle(GetProgressForEnrollmentQuery query) {
        return progressRepository.findByEnrollmentId(query.enrollmentId()).stream()
            .map(EnrollmentStepProgressResult::from)
            .collect(Collectors.toList());
    }
}

