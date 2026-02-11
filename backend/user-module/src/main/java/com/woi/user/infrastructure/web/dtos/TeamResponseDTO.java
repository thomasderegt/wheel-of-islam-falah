package com.woi.user.infrastructure.web.dtos;

import java.time.LocalDateTime;

/**
 * DTO for team response
 */
public record TeamResponseDTO(
    Long id,
    String name,
    String description,
    Long ownerId,
    String status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
