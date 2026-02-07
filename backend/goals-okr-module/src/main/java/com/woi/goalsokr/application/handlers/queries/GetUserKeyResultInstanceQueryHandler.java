package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserKeyResultInstanceQuery;
import com.woi.goalsokr.application.results.UserKeyResultInstanceResult;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Query handler for getting a user key result instance
 */
@Component
public class GetUserKeyResultInstanceQueryHandler {
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;

    public GetUserKeyResultInstanceQueryHandler(UserKeyResultInstanceRepository userKeyResultInstanceRepository) {
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
    }

    @Transactional(readOnly = true)
    public Optional<UserKeyResultInstanceResult> handle(GetUserKeyResultInstanceQuery query) {
        return userKeyResultInstanceRepository.findById(query.userKeyResultInstanceId())
            .map(UserKeyResultInstanceResult::from);
    }
}
