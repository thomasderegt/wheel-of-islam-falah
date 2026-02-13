package com.woi.user.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for team invitations received by the current user
 * Includes team name and inviter name for display
 */
public record MyTeamInvitationResult(
    Long id,
    Long teamId,
    String teamName,
    String role,
    Long invitedById,
    String inviterName,
    String token,
    LocalDateTime expiresAt,
    LocalDateTime createdAt
) {}
