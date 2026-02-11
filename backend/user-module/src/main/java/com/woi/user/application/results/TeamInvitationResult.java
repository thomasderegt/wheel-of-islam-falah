package com.woi.user.application.results;

import com.woi.user.domain.entities.TeamInvitation;
import java.time.LocalDateTime;

/**
 * Result DTO for team invitation operations
 */
public record TeamInvitationResult(
    Long id,
    Long teamId,
    String email,
    String role,
    Long invitedById,
    String token,
    LocalDateTime expiresAt,
    LocalDateTime acceptedAt,
    LocalDateTime createdAt
) {
    public static TeamInvitationResult from(TeamInvitation invitation) {
        return new TeamInvitationResult(
            invitation.getId(),
            invitation.getTeamId(),
            invitation.getEmail(),
            invitation.getRole().name(),
            invitation.getInvitedById(),
            invitation.getToken(),
            invitation.getExpiresAt(),
            invitation.getAcceptedAt(),
            invitation.getCreatedAt()
        );
    }
}
