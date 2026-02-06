package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetInitiativesByUserObjectiveInstanceQuery;
import com.woi.goalsokr.application.results.InitiativeResult;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting initiatives by user objective instance
 */
@Component
public class GetInitiativesByUserObjectiveInstanceQueryHandler {
    private final InitiativeRepository initiativeRepository;

    public GetInitiativesByUserObjectiveInstanceQueryHandler(InitiativeRepository initiativeRepository) {
        this.initiativeRepository = initiativeRepository;
    }

    @Transactional(readOnly = true)
    public List<InitiativeResult> handle(GetInitiativesByUserObjectiveInstanceQuery query) {
        return initiativeRepository.findByUserObjectiveInstanceId(query.userObjectiveInstanceId()).stream()
            .map(InitiativeResult::from)
            .collect(Collectors.toList());
    }
}
