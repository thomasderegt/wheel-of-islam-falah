package com.woi.user.application.results;

import com.woi.user.domain.entities.TeamMember;
import java.time.LocalDateTime;

/**
 * Result DTO for team member operations
 */
public record TeamMemberResult(
    Long id,
    Long teamId,
    Long userId,
    String role,
    String status,
    Long invitedById,
    LocalDateTime joinedAt,
    LocalDateTime createdAt
) {
    public static TeamMemberResult from(TeamMember member) {
        return new TeamMemberResult(
            member.getId(),
            member.getTeamId(),
            member.getUserId(),
            member.getRole().name(),
            member.getStatus().name(),
            member.getInvitedById(),
            member.getJoinedAt(),
            member.getCreatedAt()
        );
    }
}
