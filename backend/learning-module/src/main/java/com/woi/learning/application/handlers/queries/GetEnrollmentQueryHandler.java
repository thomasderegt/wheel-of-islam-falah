package com.woi.learning.application.handlers.queries;

import com.woi.learning.application.queries.GetEnrollmentQuery;
import com.woi.learning.application.results.LearningFlowEnrollmentResult;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Query handler for getting an enrollment by ID
 */
@Component
public class GetEnrollmentQueryHandler {
    private final LearningFlowEnrollmentRepository enrollmentRepository;
    
    public GetEnrollmentQueryHandler(LearningFlowEnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }
    
    @Transactional(readOnly = true)
    public LearningFlowEnrollmentResult handle(GetEnrollmentQuery query) {
        return enrollmentRepository.findById(query.enrollmentId())
            .map(LearningFlowEnrollmentResult::from)
            .orElseThrow(() -> new IllegalArgumentException("Enrollment not found: " + query.enrollmentId()));
    }
}

