package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserObjectiveInstancesQuery;
import com.woi.goalsokr.application.results.UserObjectiveInstanceResult;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting user objective instances by user id.
 */
@Component
public class GetUserObjectiveInstancesQueryHandler {
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;

    public GetUserObjectiveInstancesQueryHandler(
            UserObjectiveInstanceRepository userObjectiveInstanceRepository) {
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
    }

    @Transactional(readOnly = true)
    public List<UserObjectiveInstanceResult> handle(GetUserObjectiveInstancesQuery query) {
        return userObjectiveInstanceRepository.findByUserId(query.userId()).stream()
            .map(UserObjectiveInstanceResult::from)
            .collect(Collectors.toList());
    }
}
