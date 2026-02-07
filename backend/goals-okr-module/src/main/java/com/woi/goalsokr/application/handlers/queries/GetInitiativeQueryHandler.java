package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetInitiativeQuery;
import com.woi.goalsokr.application.results.UserInitiativeResult;
import com.woi.goalsokr.domain.repositories.UserInitiativeRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Query handler for getting a user initiative
 */
@Component
public class GetInitiativeQueryHandler {
    private final UserInitiativeRepository userInitiativeRepository;

    public GetInitiativeQueryHandler(UserInitiativeRepository userInitiativeRepository) {
        this.userInitiativeRepository = userInitiativeRepository;
    }

    @Transactional(readOnly = true)
    public Optional<UserInitiativeResult> handle(GetInitiativeQuery query) {
        return userInitiativeRepository.findById(query.initiativeId())
            .map(UserInitiativeResult::from);
    }
}
