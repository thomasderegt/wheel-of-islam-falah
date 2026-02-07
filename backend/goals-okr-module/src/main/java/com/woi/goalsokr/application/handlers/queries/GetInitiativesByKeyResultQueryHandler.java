package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetInitiativesByKeyResultQuery;
import com.woi.goalsokr.application.results.InitiativeResult;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting initiative templates by key result
 */
@Component
public class GetInitiativesByKeyResultQueryHandler {
    private final InitiativeRepository initiativeRepository;

    public GetInitiativesByKeyResultQueryHandler(InitiativeRepository initiativeRepository) {
        this.initiativeRepository = initiativeRepository;
    }

    public List<InitiativeResult> handle(GetInitiativesByKeyResultQuery query) {
        return initiativeRepository.findByKeyResultId(query.keyResultId())
                .stream()
                .map(InitiativeResult::from)
                .collect(Collectors.toList());
    }
}
