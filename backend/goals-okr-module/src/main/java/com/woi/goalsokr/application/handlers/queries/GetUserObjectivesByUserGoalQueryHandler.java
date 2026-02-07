package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserObjectivesByUserGoalQuery;
import com.woi.goalsokr.application.results.UserObjectiveResult;
import com.woi.goalsokr.domain.repositories.UserObjectiveRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting user-specific objectives by user goal
 */
@Component
public class GetUserObjectivesByUserGoalQueryHandler {
    private final UserObjectiveRepository userObjectiveRepository;

    public GetUserObjectivesByUserGoalQueryHandler(UserObjectiveRepository userObjectiveRepository) {
        this.userObjectiveRepository = userObjectiveRepository;
    }

    @Transactional(readOnly = true)
    public List<UserObjectiveResult> handle(GetUserObjectivesByUserGoalQuery query) {
        return userObjectiveRepository.findByUserGoalIdOrderedByCreatedAtDesc(query.userGoalId()).stream()
            .map(UserObjectiveResult::from)
            .collect(Collectors.toList());
    }
}
