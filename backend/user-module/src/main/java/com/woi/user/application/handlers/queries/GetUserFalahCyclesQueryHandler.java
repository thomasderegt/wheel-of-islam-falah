package com.woi.user.application.handlers.queries;

import com.woi.user.application.queries.GetUserFalahCyclesQuery;
import com.woi.user.application.results.FalahCycleResult;
import com.woi.user.domain.entities.FalahCycle;
import com.woi.user.domain.repositories.FalahCycleRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for fetching user's Falah cycles
 */
@Component
public class GetUserFalahCyclesQueryHandler {
    private final FalahCycleRepository falahCycleRepository;

    public GetUserFalahCyclesQueryHandler(FalahCycleRepository falahCycleRepository) {
        this.falahCycleRepository = falahCycleRepository;
    }

    public List<FalahCycleResult> handle(GetUserFalahCyclesQuery query) {
        return falahCycleRepository.findByUserId(query.userId()).stream()
                .map(FalahCycleResult::from)
                .collect(Collectors.toList());
    }
}
