package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserKeyResultsByUserObjectiveQuery;
import com.woi.goalsokr.application.results.UserKeyResultResult;
import com.woi.goalsokr.domain.repositories.UserKeyResultRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting user-specific key results by user objective
 */
@Component
public class GetUserKeyResultsByUserObjectiveQueryHandler {
    private final UserKeyResultRepository userKeyResultRepository;

    public GetUserKeyResultsByUserObjectiveQueryHandler(UserKeyResultRepository userKeyResultRepository) {
        this.userKeyResultRepository = userKeyResultRepository;
    }

    @Transactional(readOnly = true)
    public List<UserKeyResultResult> handle(GetUserKeyResultsByUserObjectiveQuery query) {
        return userKeyResultRepository.findByUserObjectiveIdOrderedByCreatedAtDesc(query.userObjectiveId()).stream()
            .map(UserKeyResultResult::from)
            .collect(Collectors.toList());
    }
}
