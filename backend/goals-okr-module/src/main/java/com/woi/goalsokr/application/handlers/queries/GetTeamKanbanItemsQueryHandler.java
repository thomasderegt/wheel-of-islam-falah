package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetTeamKanbanItemsQuery;
import com.woi.goalsokr.application.results.KanbanItemResult;
import com.woi.goalsokr.application.support.KanbanItemEnricher;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import com.woi.user.api.UserModuleInterface;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting team kanban items (read-only).
 * Returns items from the team owner's kanban board, enriched with title and lifeDomainId.
 */
@Component
public class GetTeamKanbanItemsQueryHandler {
    private final KanbanItemRepository kanbanItemRepository;
    private final UserModuleInterface userModule;
    private final KanbanItemEnricher enricher;

    public GetTeamKanbanItemsQueryHandler(
            KanbanItemRepository kanbanItemRepository,
            UserModuleInterface userModule,
            KanbanItemEnricher enricher) {
        this.kanbanItemRepository = kanbanItemRepository;
        this.userModule = userModule;
        this.enricher = enricher;
    }

    @Transactional(readOnly = true)
    public List<KanbanItemResult> handle(GetTeamKanbanItemsQuery query) {
        // 1. Authorization: Check if user is team member
        if (!userModule.isUserTeamMember(query.viewingUserId(), query.teamId())) {
            throw new IllegalArgumentException("User is not a member of this team");
        }

        // 2. Get owner user ID from team kanban share
        Long ownerUserId = userModule.getTeamKanbanShareOwnerId(query.teamId())
            .orElseThrow(() -> new IllegalArgumentException("Team kanban board is not shared"));

        // 3. Get kanban items from owner (not from viewing user!)
        List<com.woi.goalsokr.domain.entities.KanbanItem> items =
            kanbanItemRepository.findByUserId(ownerUserId);

        // 4. Map to enriched results and mark as read-only
        return items.stream()
            .map(item -> enricher.enrich(item, true))
            .collect(Collectors.toList());
    }
}
