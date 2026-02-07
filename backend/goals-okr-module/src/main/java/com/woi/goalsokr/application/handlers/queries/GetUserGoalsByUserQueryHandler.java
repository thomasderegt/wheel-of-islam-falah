package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserGoalsByUserQuery;
import com.woi.goalsokr.application.results.UserGoalResult;
import com.woi.goalsokr.domain.repositories.UserGoalRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting user-specific goals by user
 */
@Component
public class GetUserGoalsByUserQueryHandler {
    private final UserGoalRepository userGoalRepository;

    public GetUserGoalsByUserQueryHandler(UserGoalRepository userGoalRepository) {
        this.userGoalRepository = userGoalRepository;
    }

    @Transactional(readOnly = true)
    public List<UserGoalResult> handle(GetUserGoalsByUserQuery query) {
        return userGoalRepository.findByUserIdOrderedByCreatedAtDesc(query.userId()).stream()
            .map(UserGoalResult::from)
            .collect(Collectors.toList());
    }
}
