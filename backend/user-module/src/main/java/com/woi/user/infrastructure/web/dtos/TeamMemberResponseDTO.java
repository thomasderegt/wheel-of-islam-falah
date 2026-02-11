package com.woi.user.infrastructure.web.dtos;

import java.time.LocalDateTime;

/**
 * DTO for team member response
 */
public record TeamMemberResponseDTO(
    Long id,
    Long teamId,
    Long userId,
    String role,
    String status,
    Long invitedById,
    LocalDateTime joinedAt,
    LocalDateTime createdAt
) {}
