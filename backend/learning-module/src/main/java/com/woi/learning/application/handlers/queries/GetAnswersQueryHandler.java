package com.woi.learning.application.handlers.queries;

import com.woi.learning.application.queries.GetAnswersQuery;
import com.woi.learning.application.results.EnrollmentAnswerResult;
import com.woi.learning.domain.repositories.LearningFlowEnrollmentAnswerRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting answers for an enrollment step
 */
@Component
public class GetAnswersQueryHandler {
    private final LearningFlowEnrollmentAnswerRepository answerRepository;
    
    public GetAnswersQueryHandler(LearningFlowEnrollmentAnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
    }
    
    @Transactional(readOnly = true)
    public List<EnrollmentAnswerResult> handle(GetAnswersQuery query) {
        List<com.woi.learning.domain.entities.LearningFlowEnrollmentAnswer> answers;
        
        if (query.type() != null) {
            // Filter by type
            answers = answerRepository.findByEnrollmentIdAndStepIdAndType(
                query.enrollmentId(),
                query.stepId(),
                query.type()
            );
        } else {
            // Get all answers
            answers = answerRepository.findByEnrollmentIdAndStepId(
                query.enrollmentId(),
                query.stepId()
            );
        }
        
        return answers.stream()
            .map(EnrollmentAnswerResult::from)
            .collect(Collectors.toList());
    }
}

