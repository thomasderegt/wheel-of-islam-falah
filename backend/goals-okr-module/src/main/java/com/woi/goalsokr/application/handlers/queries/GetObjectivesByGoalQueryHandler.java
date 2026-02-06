package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetObjectivesByGoalQuery;
import com.woi.goalsokr.application.results.ObjectiveResult;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting objectives by goal
 */
@Component
public class GetObjectivesByGoalQueryHandler {
    private final ObjectiveRepository objectiveRepository;

    public GetObjectivesByGoalQueryHandler(ObjectiveRepository objectiveRepository) {
        this.objectiveRepository = objectiveRepository;
    }

    @Transactional(readOnly = true)
    public List<ObjectiveResult> handle(GetObjectivesByGoalQuery query) {
        return objectiveRepository.findByGoalIdOrderedByOrderIndex(query.goalId()).stream()
            .map(ObjectiveResult::from)
            .collect(Collectors.toList());
    }
}
