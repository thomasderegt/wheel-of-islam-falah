package com.woi.user.api;

import com.woi.user.domain.enums.Context;
import com.woi.user.domain.enums.GoalsOkrContext;
import java.time.LocalDateTime;

/**
 * Summary DTO for UserPreference
 * Used by other modules to get user preference information
 */
public record UserPreferenceSummary(
    Long id,
    Long userId,
    Context defaultContext,
    GoalsOkrContext defaultGoalsOkrContext,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
