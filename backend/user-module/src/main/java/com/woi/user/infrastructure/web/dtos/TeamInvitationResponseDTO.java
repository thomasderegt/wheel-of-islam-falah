package com.woi.user.infrastructure.web.dtos;

import java.time.LocalDateTime;

/**
 * DTO for team invitation response
 */
public record TeamInvitationResponseDTO(
    Long id,
    Long teamId,
    String email,
    String role,
    Long invitedById,
    String token,
    LocalDateTime expiresAt,
    LocalDateTime acceptedAt,
    LocalDateTime createdAt
) {}
