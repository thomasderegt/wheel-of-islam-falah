package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetUserInitiativeInstanceQuery;
import com.woi.goalsokr.application.results.UserInitiativeInstanceResult;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Query handler for getting a user initiative instance
 */
@Component
public class GetUserInitiativeInstanceQueryHandler {
    private final UserInitiativeInstanceRepository userInitiativeInstanceRepository;

    public GetUserInitiativeInstanceQueryHandler(UserInitiativeInstanceRepository userInitiativeInstanceRepository) {
        this.userInitiativeInstanceRepository = userInitiativeInstanceRepository;
    }

    @Transactional(readOnly = true)
    public Optional<UserInitiativeInstanceResult> handle(GetUserInitiativeInstanceQuery query) {
        return userInitiativeInstanceRepository.findById(query.userInitiativeInstanceId())
            .map(UserInitiativeInstanceResult::from);
    }
}
