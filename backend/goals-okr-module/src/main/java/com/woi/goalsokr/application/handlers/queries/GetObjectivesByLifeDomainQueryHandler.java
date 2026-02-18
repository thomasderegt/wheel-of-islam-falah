package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetObjectivesByLifeDomainQuery;
import com.woi.goalsokr.application.results.ObjectiveResult;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting objectives by life domain
 */
@Component
public class GetObjectivesByLifeDomainQueryHandler {
    private final ObjectiveRepository objectiveRepository;

    public GetObjectivesByLifeDomainQueryHandler(ObjectiveRepository objectiveRepository) {
        this.objectiveRepository = objectiveRepository;
    }

    @Transactional(readOnly = true)
    public List<ObjectiveResult> handle(GetObjectivesByLifeDomainQuery query) {
        return objectiveRepository.findByLifeDomainIdOrderedByOrderIndex(query.lifeDomainId()).stream()
            .map(ObjectiveResult::from)
            .collect(Collectors.toList());
    }
}
