package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.ShareTeamKanbanCommand;
import com.woi.user.application.results.TeamKanbanShareResult;
import com.woi.user.domain.entities.TeamKanbanShare;
import com.woi.user.domain.repositories.TeamKanbanShareRepository;
import com.woi.user.domain.repositories.TeamRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for sharing a team kanban board
 */
@Component
public class ShareTeamKanbanCommandHandler {
    private final TeamKanbanShareRepository shareRepository;
    private final TeamRepository teamRepository;
    
    public ShareTeamKanbanCommandHandler(
            TeamKanbanShareRepository shareRepository,
            TeamRepository teamRepository) {
        this.shareRepository = shareRepository;
        this.teamRepository = teamRepository;
    }
    
    @Transactional
    public TeamKanbanShareResult handle(ShareTeamKanbanCommand command) {
        // 1. Validate team exists
        teamRepository.findById(command.teamId())
            .orElseThrow(() -> new IllegalArgumentException("Team not found: " + command.teamId()));
        
        // 2. Check if already shared
        if (shareRepository.existsActiveByTeamId(command.teamId())) {
            throw new IllegalArgumentException("Kanban board is already shared for this team");
        }
        
        // 3. Create share
        TeamKanbanShare share = TeamKanbanShare.create(command.teamId(), command.ownerUserId());
        TeamKanbanShare saved = shareRepository.save(share);
        
        return TeamKanbanShareResult.from(saved);
    }
}
