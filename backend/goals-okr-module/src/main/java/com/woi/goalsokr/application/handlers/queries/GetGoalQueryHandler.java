package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetGoalQuery;
import com.woi.goalsokr.application.results.GoalResult;
import com.woi.goalsokr.domain.repositories.GoalRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Query handler for getting a goal by ID
 */
@Component
public class GetGoalQueryHandler {
    private final GoalRepository goalRepository;

    public GetGoalQueryHandler(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    @Transactional(readOnly = true)
    public Optional<GoalResult> handle(GetGoalQuery query) {
        return goalRepository.findById(query.goalId())
            .map(GoalResult::from);
    }
}
