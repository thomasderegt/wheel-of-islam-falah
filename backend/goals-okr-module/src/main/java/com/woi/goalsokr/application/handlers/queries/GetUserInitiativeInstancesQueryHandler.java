package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserInitiativeInstancesQuery;
import com.woi.goalsokr.application.results.UserInitiativeInstanceResult;
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

    public GetUserInitiativeInstancesQueryHandler(
            UserInitiativeInstanceRepository userInitiativeInstanceRepository,
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            UserObjectiveInstanceRepository userObjectiveInstanceRepository) {
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
    }

    @Transactional(readOnly = true)
    public List<UserInitiativeInstanceResult> handle(GetUserInitiativeInstancesQuery query) {
        var userObjectiveInstances = userObjectiveInstanceRepository.findByUserId(query.userId());
        var userObjectiveInstanceIds = userObjectiveInstances.stream()
            .map(uoi -> uoi.getId())
            .collect(Collectors.toList());

        var userKeyResultInstances = userKeyResultInstanceRepository.findByUserObjectiveInstanceIdIn(userObjectiveInstanceIds);
        var userKeyResultInstanceIds = userKeyResultInstances.stream()
            .map(ukri -> ukri.getId())
            .collect(Collectors.toList());

        var userInitiativeInstances = userInitiativeInstanceRepository.findByUserKeyResultInstanceIdIn(userKeyResultInstanceIds);

        return userInitiativeInstances.stream()
            .map(UserInitiativeInstanceResult::from)
            .collect(Collectors.toList());
    }
}
