package com.woi.user.api;

import com.woi.user.domain.enums.UserStatus;
import java.time.LocalDateTime;

/**
 * Summary DTO for User
 * Used by other modules to get user information
 */
public record UserSummary(
    Long id,
    String email,
    String profileName,
    UserStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
