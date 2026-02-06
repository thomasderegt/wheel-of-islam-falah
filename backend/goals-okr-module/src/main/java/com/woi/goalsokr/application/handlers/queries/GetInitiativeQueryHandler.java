package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetInitiativeQuery;
import com.woi.goalsokr.application.results.InitiativeResult;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Query handler for getting an initiative
 */
@Component
public class GetInitiativeQueryHandler {
    private final InitiativeRepository initiativeRepository;

    public GetInitiativeQueryHandler(InitiativeRepository initiativeRepository) {
        this.initiativeRepository = initiativeRepository;
    }

    @Transactional(readOnly = true)
    public Optional<InitiativeResult> handle(GetInitiativeQuery query) {
        return initiativeRepository.findById(query.initiativeId())
            .map(InitiativeResult::from);
    }
}
