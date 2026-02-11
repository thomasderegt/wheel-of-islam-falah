package com.woi.user.domain.repositories;

import com.woi.user.domain.entities.TeamInvitation;
import java.util.List;
import java.util.Optional;

/**
 * TeamInvitation repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface TeamInvitationRepository {
    Optional<TeamInvitation> findById(Long id);
    Optional<TeamInvitation> findByToken(String token);
    List<TeamInvitation> findByTeamId(Long teamId);
    List<TeamInvitation> findByEmail(String email);
    List<TeamInvitation> findByTeamIdAndEmail(Long teamId, String email);
    TeamInvitation save(TeamInvitation invitation);
    void delete(TeamInvitation invitation);
}
