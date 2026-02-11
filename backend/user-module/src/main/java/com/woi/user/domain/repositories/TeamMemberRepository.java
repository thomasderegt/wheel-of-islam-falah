package com.woi.user.domain.repositories;

import com.woi.user.domain.entities.TeamMember;
import com.woi.user.domain.enums.TeamMemberStatus;
import java.util.List;
import java.util.Optional;

/**
 * TeamMember repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface TeamMemberRepository {
    Optional<TeamMember> findById(Long id);
    Optional<TeamMember> findByTeamIdAndUserId(Long teamId, Long userId);
    List<TeamMember> findByTeamId(Long teamId);
    List<TeamMember> findByTeamIdAndStatus(Long teamId, TeamMemberStatus status);
    List<TeamMember> findByUserId(Long userId);
    List<TeamMember> findByUserIdAndStatus(Long userId, TeamMemberStatus status);
    boolean existsByTeamIdAndUserId(Long teamId, Long userId);
    boolean existsByTeamIdAndUserIdAndStatus(Long teamId, Long userId, TeamMemberStatus status);
    TeamMember save(TeamMember member);
    void delete(TeamMember member);
}
