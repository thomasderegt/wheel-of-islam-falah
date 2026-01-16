package com.woi.user.application.results;

import com.woi.user.domain.entities.User;
import com.woi.user.domain.enums.UserStatus;
import java.time.LocalDateTime;

/**
 * Result DTO for user operations
 */
public record UserResult(
    Long id,
    String email,
    String profileName,
    UserStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static UserResult from(User user) {
        return new UserResult(
            user.getId(),
            user.getEmail(),
            user.getProfileName(),
            user.getStatus(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}

