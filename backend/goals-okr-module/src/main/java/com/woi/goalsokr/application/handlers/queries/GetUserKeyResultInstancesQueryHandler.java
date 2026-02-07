package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserKeyResultInstancesQuery;
import com.woi.goalsokr.application.results.UserKeyResultInstanceResult;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting all user key result instances for a user
 */
@Component
public class GetUserKeyResultInstancesQueryHandler {
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;
    private final UserGoalInstanceRepository userGoalInstanceRepository;

    public GetUserKeyResultInstancesQueryHandler(
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            UserGoalInstanceRepository userGoalInstanceRepository) {
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.userGoalInstanceRepository = userGoalInstanceRepository;
    }

    @Transactional(readOnly = true)
    public List<UserKeyResultInstanceResult> handle(GetUserKeyResultInstancesQuery query) {
        // Get all user goal instances for the user
        var userGoalInstances = userGoalInstanceRepository.findByUserId(query.userId());
        var userGoalInstanceIds = userGoalInstances.stream()
            .map(ugi -> ugi.getId())
            .collect(Collectors.toList());

        // Get all user objective instances for these goal instances
        var userObjectiveInstances = userObjectiveInstanceRepository.findByUserGoalInstanceIdIn(userGoalInstanceIds);
        var userObjectiveInstanceIds = userObjectiveInstances.stream()
            .map(uoi -> uoi.getId())
            .collect(Collectors.toList());

        // Get all user key result instances for these objective instances
        var userKeyResultInstances = userKeyResultInstanceRepository.findByUserObjectiveInstanceIdIn(userObjectiveInstanceIds);

        // Convert to results
        return userKeyResultInstances.stream()
            .map(UserKeyResultInstanceResult::from)
            .collect(Collectors.toList());
    }
}
