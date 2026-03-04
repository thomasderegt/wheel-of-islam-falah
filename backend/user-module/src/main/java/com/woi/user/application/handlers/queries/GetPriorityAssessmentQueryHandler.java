package com.woi.user.application.handlers.queries;

import com.woi.user.application.queries.GetPriorityAssessmentQuery;
import com.woi.user.application.results.PriorityAssessmentResult;
import com.woi.user.domain.entities.PriorityAssessment;
import com.woi.user.domain.repositories.PriorityAssessmentRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class GetPriorityAssessmentQueryHandler {
    private final PriorityAssessmentRepository repository;

    public GetPriorityAssessmentQueryHandler(PriorityAssessmentRepository repository) {
        this.repository = repository;
    }

    public Optional<PriorityAssessmentResult> handle(GetPriorityAssessmentQuery query) {
        Optional<PriorityAssessment> assessment = query.falahCycleId() != null
            ? repository.findByUserIdAndFalahCycleId(query.userId(), query.falahCycleId())
            : repository.findByUserIdAndFalahCycleIdIsNull(query.userId());

        return assessment.map(PriorityAssessmentResult::from);
    }
}
