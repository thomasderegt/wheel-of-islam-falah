package com.woi.user.application.handlers.queries;

import com.woi.user.application.queries.GetTeamKanbanShareQuery;
import com.woi.user.application.results.TeamKanbanShareResult;
import com.woi.user.domain.repositories.TeamKanbanShareRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Query handler for getting team kanban share
 */
@Component
public class GetTeamKanbanShareQueryHandler {
    private final TeamKanbanShareRepository shareRepository;
    
    public GetTeamKanbanShareQueryHandler(TeamKanbanShareRepository shareRepository) {
        this.shareRepository = shareRepository;
    }
    
    @Transactional(readOnly = true)
    public Optional<TeamKanbanShareResult> handle(GetTeamKanbanShareQuery query) {
        return shareRepository.findActiveByTeamId(query.teamId())
            .map(TeamKanbanShareResult::from);
    }
}
