package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetKanbanItemsByUserQuery;
import com.woi.goalsokr.application.results.KanbanItemResult;
import com.woi.goalsokr.application.support.KanbanItemEnricher;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting kanban items by user.
 * Returns items enriched with title and lifeDomainId.
 */
@Component
public class GetKanbanItemsByUserQueryHandler {
    private final KanbanItemRepository kanbanItemRepository;
    private final KanbanItemEnricher enricher;

    public GetKanbanItemsByUserQueryHandler(
            KanbanItemRepository kanbanItemRepository,
            KanbanItemEnricher enricher) {
        this.kanbanItemRepository = kanbanItemRepository;
        this.enricher = enricher;
    }

    @Transactional(readOnly = true)
    public List<KanbanItemResult> handle(GetKanbanItemsByUserQuery query) {
        return kanbanItemRepository.findByUserId(query.userId()).stream()
            .map(item -> enricher.enrich(item, false))
            .collect(Collectors.toList());
    }
}
