package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetKanbanItemsByUserQuery;
import com.woi.goalsokr.application.results.KanbanItemResult;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting kanban items by user
 */
@Component
public class GetKanbanItemsByUserQueryHandler {
    private final KanbanItemRepository kanbanItemRepository;

    public GetKanbanItemsByUserQueryHandler(KanbanItemRepository kanbanItemRepository) {
        this.kanbanItemRepository = kanbanItemRepository;
    }

    @Transactional(readOnly = true)
    public List<KanbanItemResult> handle(GetKanbanItemsByUserQuery query) {
        return kanbanItemRepository.findByUserId(query.userId()).stream()
            .map(KanbanItemResult::from)
            .collect(Collectors.toList());
    }
}
