package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetObjectiveQuery;
import com.woi.goalsokr.application.results.ObjectiveResult;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Query handler for getting an objective
 */
@Component
public class GetObjectiveQueryHandler {
    private final ObjectiveRepository objectiveRepository;

    public GetObjectiveQueryHandler(ObjectiveRepository objectiveRepository) {
        this.objectiveRepository = objectiveRepository;
    }

    @Transactional(readOnly = true)
    public Optional<ObjectiveResult> handle(GetObjectiveQuery query) {
        return objectiveRepository.findById(query.objectiveId())
            .map(ObjectiveResult::from);
    }
}
