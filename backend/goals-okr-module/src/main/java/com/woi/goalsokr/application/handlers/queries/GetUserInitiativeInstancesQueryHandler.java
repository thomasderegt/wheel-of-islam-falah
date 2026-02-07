package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserInitiativeInstancesQuery;
import com.woi.goalsokr.application.results.UserInitiativeInstanceResult;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting all user initiative instances for a user
 */
@Component
public class GetUserInitiativeInstancesQueryHandler {
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;
    private final UserGoalInstanceRepository userGoalInstanceRepository;

    public GetUserInitiativeInstancesQueryHandler(
            UserInitiativeInstanceRepository userInitiativeInstanceRepository,
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            UserObjectiveInstanceRepository userObjectiveInstanceRepository,
            UserGoalInstanceRepository userGoalInstanceRepository) {
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
        this.userGoalInstanceRepository = userGoalInstanceRepository;
    }

    @Transactional(readOnly = true)
    public List<UserInitiativeInstanceResult> handle(GetUserInitiativeInstancesQuery query) {
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
        var userKeyResultInstanceIds = userKeyResultInstances.stream()
            .map(ukri -> ukri.getId())
            .collect(Collectors.toList());

        // Get all user initiative instances for these key result instances
        var userInitiativeInstances = userInitiativeInstanceRepository.findByUserKeyResultInstanceIdIn(userKeyResultInstanceIds);

        // Convert to results
        return userInitiativeInstances.stream()
            .map(UserInitiativeInstanceResult::from)
            .collect(Collectors.toList());
    }
}
