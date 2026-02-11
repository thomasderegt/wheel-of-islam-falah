package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.UnshareTeamKanbanCommand;
import com.woi.user.application.results.TeamKanbanShareResult;
import com.woi.user.domain.entities.TeamKanbanShare;
import com.woi.user.domain.repositories.TeamKanbanShareRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for unsharing a team kanban board
 */
@Component
public class UnshareTeamKanbanCommandHandler {
    private final TeamKanbanShareRepository shareRepository;
    
    public UnshareTeamKanbanCommandHandler(TeamKanbanShareRepository shareRepository) {
        this.shareRepository = shareRepository;
    }
    
    @Transactional
    public TeamKanbanShareResult handle(UnshareTeamKanbanCommand command) {
        // 1. Find active share
        TeamKanbanShare share = shareRepository.findActiveByTeamId(command.teamId())
            .orElseThrow(() -> new IllegalArgumentException("No active kanban share found for this team"));
        
        // 2. Validate owner
        if (!share.getOwnerUserId().equals(command.ownerUserId())) {
            throw new IllegalArgumentException("Only the owner can unshare the kanban board");
        }
        
        // 3. Unshare (soft delete)
        share.unshare();
        TeamKanbanShare saved = shareRepository.save(share);
        
        return TeamKanbanShareResult.from(saved);
    }
}
