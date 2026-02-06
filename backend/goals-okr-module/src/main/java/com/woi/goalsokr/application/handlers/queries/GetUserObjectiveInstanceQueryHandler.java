package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserObjectiveInstanceQuery;
import com.woi.goalsokr.application.results.UserObjectiveInstanceResult;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Query handler for getting a user objective instance
 */
@Component
public class GetUserObjectiveInstanceQueryHandler {
    private final UserObjectiveInstanceRepository userObjectiveInstanceRepository;

    public GetUserObjectiveInstanceQueryHandler(UserObjectiveInstanceRepository userObjectiveInstanceRepository) {
        this.userObjectiveInstanceRepository = userObjectiveInstanceRepository;
    }

    @Transactional(readOnly = true)
    public Optional<UserObjectiveInstanceResult> handle(GetUserObjectiveInstanceQuery query) {
        return userObjectiveInstanceRepository.findById(query.userObjectiveInstanceId())
            .map(UserObjectiveInstanceResult::from);
    }
}
