package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetKeyResultsByObjectiveQuery;
import com.woi.goalsokr.application.results.KeyResultResult;
import com.woi.goalsokr.domain.entities.KeyResult;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting key results by objective
 */
@Component
public class GetKeyResultsByObjectiveQueryHandler {
    private final KeyResultRepository keyResultRepository;

    public GetKeyResultsByObjectiveQueryHandler(KeyResultRepository keyResultRepository) {
        this.keyResultRepository = keyResultRepository;
    }

    @Transactional(readOnly = true)
    public List<KeyResultResult> handle(GetKeyResultsByObjectiveQuery query) {
        List<KeyResult> keyResults = query.userId() != null
            ? keyResultRepository.findByObjectiveIdAndUserFilteredOrderedByOrderIndex(query.objectiveId(), query.userId())
            : keyResultRepository.findByObjectiveIdOrderedByOrderIndex(query.objectiveId()).stream()
                .filter(kr -> kr.getCreatedByUserId() == null)
                .collect(Collectors.toList());
        return keyResults.stream()
            .map(KeyResultResult::from)
            .collect(Collectors.toList());
    }
}
