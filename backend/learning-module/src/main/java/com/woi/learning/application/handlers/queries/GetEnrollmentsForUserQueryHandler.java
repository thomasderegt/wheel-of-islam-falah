package com.woi.learning.application.handlers.queries;

import com.woi.learning.application.queries.GetEnrollmentsForUserQuery;
import com.woi.learning.application.results.LearningFlowEnrollmentResult;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting all enrollments for a user
 */
@Component
public class GetEnrollmentsForUserQueryHandler {
    private final LearningFlowEnrollmentRepository enrollmentRepository;
    
    public GetEnrollmentsForUserQueryHandler(LearningFlowEnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }
    
    @Transactional(readOnly = true)
    public List<LearningFlowEnrollmentResult> handle(GetEnrollmentsForUserQuery query) {
        return enrollmentRepository.findByUserId(query.userId()).stream()
            .map(LearningFlowEnrollmentResult::from)
            .collect(Collectors.toList());
    }
}

