package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserGoalInstancesByUserQuery;
import com.woi.goalsokr.application.results.UserGoalInstanceResult;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting all user goal instances for a user
 * (In which goals is user subscribed?)
 */
@Component
public class GetUserGoalInstancesByUserQueryHandler {
    private final UserGoalInstanceRepository userGoalInstanceRepository;

    public GetUserGoalInstancesByUserQueryHandler(UserGoalInstanceRepository userGoalInstanceRepository) {
        this.userGoalInstanceRepository = userGoalInstanceRepository;
    }

    @Transactional(readOnly = true)
    public List<UserGoalInstanceResult> handle(GetUserGoalInstancesByUserQuery query) {
        return userGoalInstanceRepository.findByUserId(query.userId()).stream()
            .map(UserGoalInstanceResult::from)
            .collect(Collectors.toList());
    }
}
