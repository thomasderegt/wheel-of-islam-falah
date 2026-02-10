package com.woi.user.infrastructure.web.dtos;

import com.woi.user.domain.enums.GoalsOkrContext;

/**
 * DTO for updating user preferences request
 * Note: defaultMode is no longer used - always SUCCESS
 * Note: defaultContext is always SUCCESS (Content Context)
 */
public class UpdateUserPreferencesRequestDTO {
    
    private GoalsOkrContext defaultGoalsOkrContext; // Optional - defaults to NONE if not provided
    
    public GoalsOkrContext getDefaultGoalsOkrContext() {
        return defaultGoalsOkrContext;
    }
    
    public void setDefaultGoalsOkrContext(GoalsOkrContext defaultGoalsOkrContext) {
        this.defaultGoalsOkrContext = defaultGoalsOkrContext;
    }
}
