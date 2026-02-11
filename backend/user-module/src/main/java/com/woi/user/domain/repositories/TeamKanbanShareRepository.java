package com.woi.user.domain.repositories;

import com.woi.user.domain.entities.TeamKanbanShare;
import java.util.Optional;

/**
 * TeamKanbanShare repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface TeamKanbanShareRepository {
    Optional<TeamKanbanShare> findById(Long id);
    Optional<TeamKanbanShare> findActiveByTeamId(Long teamId);
    boolean existsActiveByTeamId(Long teamId);
    TeamKanbanShare save(TeamKanbanShare share);
    void delete(TeamKanbanShare share);
}
