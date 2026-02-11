package com.woi.user.application.results;

import com.woi.user.domain.entities.TeamKanbanShare;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Result DTO for team kanban share operations
 */
public record TeamKanbanShareResult(
    Long id,
    Long teamId,
    Long ownerUserId,
    LocalDateTime sharedAt,
    LocalDateTime unsharedAt,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static TeamKanbanShareResult from(TeamKanbanShare share) {
        return new TeamKanbanShareResult(
            share.getId(),
            share.getTeamId(),
            share.getOwnerUserId(),
            share.getSharedAt(),
            share.getUnsharedAt(),
            share.getCreatedAt(),
            share.getUpdatedAt()
        );
    }
    
    public static Optional<TeamKanbanShareResult> fromOptional(Optional<TeamKanbanShare> share) {
        return share.map(TeamKanbanShareResult::from);
    }
}
