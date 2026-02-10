package com.woi.user.infrastructure.web.dtos;

import com.woi.user.domain.enums.Context;
import com.woi.user.domain.enums.GoalsOkrContext;
import java.time.LocalDateTime;

/**
 * DTO for user preference response
 * Note: defaultMode is no longer used - always SUCCESS
 * Note: defaultContext is always SUCCESS (Content Context)
 */
public class UserPreferenceResponseDTO {
    private Long id;
    private Long userId;
    private Context defaultContext; // Always SUCCESS (Content Context)
    private GoalsOkrContext defaultGoalsOkrContext;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Context getDefaultContext() { return defaultContext; }
    public void setDefaultContext(Context defaultContext) { this.defaultContext = defaultContext; }
    
    public GoalsOkrContext getDefaultGoalsOkrContext() { return defaultGoalsOkrContext; }
    public void setDefaultGoalsOkrContext(GoalsOkrContext defaultGoalsOkrContext) { 
        this.defaultGoalsOkrContext = defaultGoalsOkrContext; 
    }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
