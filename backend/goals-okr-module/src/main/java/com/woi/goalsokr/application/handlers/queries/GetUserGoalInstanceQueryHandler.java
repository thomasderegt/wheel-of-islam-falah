package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserGoalInstanceQuery;
import com.woi.goalsokr.application.results.UserGoalInstanceResult;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Query handler for getting a user goal instance by ID
 */
@Component
public class GetUserGoalInstanceQueryHandler {
    private final UserGoalInstanceRepository userGoalInstanceRepository;

    public GetUserGoalInstanceQueryHandler(UserGoalInstanceRepository userGoalInstanceRepository) {
        this.userGoalInstanceRepository = userGoalInstanceRepository;
    }

    @Transactional(readOnly = true)
    public Optional<UserGoalInstanceResult> handle(GetUserGoalInstanceQuery query) {
        return userGoalInstanceRepository.findById(query.userGoalInstanceId())
            .map(UserGoalInstanceResult::from);
    }
}
