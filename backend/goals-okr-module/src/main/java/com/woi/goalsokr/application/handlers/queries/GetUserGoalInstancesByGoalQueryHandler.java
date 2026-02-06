package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserGoalInstancesByGoalQuery;
import com.woi.goalsokr.application.results.UserGoalInstanceResult;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting all user goal instances for a goal
 * (Which users are subscribed to this goal?)
 */
@Component
public class GetUserGoalInstancesByGoalQueryHandler {
    private final UserGoalInstanceRepository userGoalInstanceRepository;

    public GetUserGoalInstancesByGoalQueryHandler(UserGoalInstanceRepository userGoalInstanceRepository) {
        this.userGoalInstanceRepository = userGoalInstanceRepository;
    }

    @Transactional(readOnly = true)
    public List<UserGoalInstanceResult> handle(GetUserGoalInstancesByGoalQuery query) {
        return userGoalInstanceRepository.findByGoalId(query.goalId()).stream()
            .map(UserGoalInstanceResult::from)
            .collect(Collectors.toList());
    }
}
