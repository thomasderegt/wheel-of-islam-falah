package com.woi.user.application.commands;

import com.woi.user.domain.enums.Context;
import com.woi.user.domain.enums.GoalsOkrContext;

/**
 * Command for updating user preferences
 */
public record UpdateUserPreferencesCommand(
    Long userId,
    Context defaultContext,
    GoalsOkrContext defaultGoalsOkrContext
) {
    public UpdateUserPreferencesCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (defaultContext == null) {
            throw new IllegalArgumentException("Default context cannot be null");
        }
        // defaultGoalsOkrContext can be null - will default to NONE
    }
}
