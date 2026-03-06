package com.woi.user.application.results;

import com.woi.user.domain.enums.UserRole;
import com.woi.user.domain.enums.UserStatus;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Result for one user in the admin user list (includes roles).
 */
public record AdminUserListItemResult(
    Long id,
    String email,
    String profileName,
    UserStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<UserRole> roles
) {}
