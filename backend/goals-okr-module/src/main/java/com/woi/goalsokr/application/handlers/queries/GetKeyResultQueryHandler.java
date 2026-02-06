package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetKeyResultQuery;
import com.woi.goalsokr.application.results.KeyResultResult;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Query handler for getting a key result
 */
@Component
public class GetKeyResultQueryHandler {
    private final KeyResultRepository keyResultRepository;

    public GetKeyResultQueryHandler(KeyResultRepository keyResultRepository) {
        this.keyResultRepository = keyResultRepository;
    }

    @Transactional(readOnly = true)
    public Optional<KeyResultResult> handle(GetKeyResultQuery query) {
        return keyResultRepository.findById(query.keyResultId())
            .map(KeyResultResult::from);
    }
}
