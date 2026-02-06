package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetGoalsByLifeDomainQuery;
import com.woi.goalsokr.application.results.GoalResult;
import com.woi.goalsokr.domain.repositories.GoalRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting goals by life domain
 */
@Component
public class GetGoalsByLifeDomainQueryHandler {
    private final GoalRepository goalRepository;

    public GetGoalsByLifeDomainQueryHandler(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    @Transactional(readOnly = true)
    public List<GoalResult> handle(GetGoalsByLifeDomainQuery query) {
        return goalRepository.findByLifeDomainIdOrderedByOrderIndex(query.lifeDomainId()).stream()
            .map(GoalResult::from)
            .collect(Collectors.toList());
    }
}
