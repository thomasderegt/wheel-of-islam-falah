package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetKeyResultProgressQuery;
import com.woi.goalsokr.application.results.KeyResultProgressResult;
import com.woi.goalsokr.domain.repositories.KeyResultProgressRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Query handler for getting key result progress
 */
@Component
public class GetKeyResultProgressQueryHandler {
    private final KeyResultProgressRepository progressRepository;

    public GetKeyResultProgressQueryHandler(KeyResultProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    @Transactional(readOnly = true)
    public Optional<KeyResultProgressResult> handle(GetKeyResultProgressQuery query) {
        // Query via userKeyResultInstanceId (strikt DDD), then filter by keyResultId
        return progressRepository.findByUserKeyResultInstanceId(query.userKeyResultInstanceId()).stream()
            .filter(p -> p.getKeyResultId().equals(query.keyResultId()))
            .findFirst()
            .map(KeyResultProgressResult::from);
    }
}
