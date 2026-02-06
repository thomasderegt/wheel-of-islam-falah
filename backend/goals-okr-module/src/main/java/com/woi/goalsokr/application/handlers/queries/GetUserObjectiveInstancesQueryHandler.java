package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserObjectiveInstancesQuery;
import com.woi.goalsokr.application.results.UserObjectiveInstanceResult;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting user objective instances
 * Queries via aggregate root (UserGoalInstance) following strict DDD
 */
@Component
public class GetUserObjectiveInstancesQueryHandler {
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;
    private final UserGoalInstanceRepository userGoalInstanceRepository;

    public GetUserObjectiveInstancesQueryHandler(
            UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            UserGoalInstanceRepository userGoalInstanceRepository) {
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.userGoalInstanceRepository = userGoalInstanceRepository;
    }

    @Transactional(readOnly = true)
    public List<UserObjectiveInstanceResult> handle(GetUserObjectiveInstancesQuery query) {
        // Step 1: Get all UserGoalInstances for the user (aggregate root)
        var userGoalInstances = userGoalInstanceRepository.findByUserId(query.userId());
        
        // Step 2: Get all UserObjectiveInstances for these goal instances
        var goalInstanceIds = userGoalInstances.stream()
            .map(ugi -> ugi.getId())
            .collect(Collectors.toList());
        
        return userObjectiveInstanceRepository.findByUserGoalInstanceIdIn(goalInstanceIds).stream()
            .map(UserObjectiveInstanceResult::from)
            .collect(Collectors.toList());
    }
}
