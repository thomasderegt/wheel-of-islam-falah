package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserKeyResultInstancesQuery;
import com.woi.goalsokr.application.results.UserKeyResultInstanceResult;
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

    public GetUserKeyResultInstancesQueryHandler(
            UserKeyResultInstanceRepository userKeyResultInstanceRepository,
            UserObjectiveInstanceRepository userObjectiveInstanceRepository) {
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
    }

    @Transactional(readOnly = true)
    public List<UserKeyResultInstanceResult> handle(GetUserKeyResultInstancesQuery query) {
        var userObjectiveInstances = userObjectiveInstanceRepository.findByUserId(query.userId());
        var userObjectiveInstanceIds = userObjectiveInstances.stream()
            .map(uoi -> uoi.getId())
            .collect(Collectors.toList());

        var userKeyResultInstances = userKeyResultInstanceRepository.findByUserObjectiveInstanceIdIn(userObjectiveInstanceIds);

        return userKeyResultInstances.stream()
            .map(UserKeyResultInstanceResult::from)
            .collect(Collectors.toList());
    }
}
