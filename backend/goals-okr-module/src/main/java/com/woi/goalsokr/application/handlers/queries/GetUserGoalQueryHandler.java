package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserGoalQuery;
import com.woi.goalsokr.application.results.UserGoalResult;
import com.woi.goalsokr.domain.repositories.UserGoalRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Query handler for getting a user goal by ID
 */
@Component
public class GetUserGoalQueryHandler {
    private final UserGoalRepository userGoalRepository;

    public GetUserGoalQueryHandler(UserGoalRepository userGoalRepository) {
        this.userGoalRepository = userGoalRepository;
    }

    @Transactional(readOnly = true)
    public Optional<UserGoalResult> handle(GetUserGoalQuery query) {
        return userGoalRepository.findById(query.userGoalId())
            .map(UserGoalResult::from);
    }
}
