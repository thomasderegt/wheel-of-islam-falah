package com.woi.user.infrastructure.web.dtos;

import java.time.LocalDateTime;

/**
 * DTO for team invitations received by the current user
 */
public record MyTeamInvitationResponseDTO(
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
