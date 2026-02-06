package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetInitiativesByUserQuery;
import com.woi.goalsokr.application.results.InitiativeResult;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting initiatives by user
 * Queries via aggregate root (UserGoalInstance) following strict DDD
 */
@Component
public class GetInitiativesByUserQueryHandler {
    private final InitiativeRepository initiativeRepository;
    private final UserGoalInstanceRepository userGoalInstanceRepository;
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;

    public GetInitiativesByUserQueryHandler(
            InitiativeRepository initiativeRepository,
            UserGoalInstanceRepository userGoalInstanceRepository,
            UserObjectiveInstanceRepository userObjectiveInstanceRepository) {
        this.initiativeRepository = initiativeRepository;
        this.userGoalInstanceRepository = userGoalInstanceRepository;
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
    }

    @Transactional(readOnly = true)
    public List<InitiativeResult> handle(GetInitiativesByUserQuery query) {
        // Step 1: Get all UserGoalInstances for the user (aggregate root)
        var userGoalInstances = userGoalInstanceRepository.findByUserId(query.userId());
        
        // Step 2: Get all UserObjectiveInstances for these goal instances
        var goalInstanceIds = userGoalInstances.stream()
            .map(ugi -> ugi.getId())
            .collect(Collectors.toList());
        
        var objectiveInstances = userObjectiveInstanceRepository.findByUserGoalInstanceIdIn(goalInstanceIds);
        
        // Step 3: Get all Initiatives for these objective instances
        var objectiveInstanceIds = objectiveInstances.stream()
            .map(uoi -> uoi.getId())
            .collect(Collectors.toList());
        
        return objectiveInstanceIds.stream()
            .flatMap(id -> initiativeRepository.findByUserObjectiveInstanceId(id).stream())
            .map(InitiativeResult::from)
            .collect(Collectors.toList());
    }
}
