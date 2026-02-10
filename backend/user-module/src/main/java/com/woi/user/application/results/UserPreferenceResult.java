package com.woi.user.application.results;

import com.woi.user.domain.entities.UserPreference;
import com.woi.user.domain.enums.Context;
import com.woi.user.domain.enums.GoalsOkrContext;
import java.time.LocalDateTime;

/**
 * Result DTO for user preference operations
 */
public record UserPreferenceResult(
    Long id,
    Long userId,
    Context defaultContext,
    GoalsOkrContext defaultGoalsOkrContext,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static UserPreferenceResult from(UserPreference preference) {
        return new UserPreferenceResult(
            preference.getId(),
            preference.getUserId(),
            preference.getDefaultContext(),
            preference.getDefaultGoalsOkrContext(),
            preference.getCreatedAt(),
            preference.getUpdatedAt()
        );
    }
}
