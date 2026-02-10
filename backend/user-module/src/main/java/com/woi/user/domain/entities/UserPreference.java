package com.woi.user.domain.entities;

import com.woi.user.domain.enums.Context;
import com.woi.user.domain.enums.GoalsOkrContext;
import java.time.LocalDateTime;

/**
 * UserPreference domain entity - Pure POJO (no JPA annotations)
 * 
 * Represents user-specific preferences including context.
 * 
 * Business rules:
 * - userId is required and unique (one preference record per user)
 * - defaultContext is always SUCCESS (Content Context)
 * - defaultGoalsOkrContext defaults to NONE (hides Goal/Execute/Insight navigation)
 */
public class UserPreference {
    private Long id;
    private Long userId; // Required - FK to users.users
    private Context defaultContext;  // Always SUCCESS (Content Context)
    private GoalsOkrContext defaultGoalsOkrContext; // Default Goals-OKR context (NONE/LIFE/BUSINESS/WORK)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Public constructor for mappers (infrastructure layer)
    public UserPreference() {}
    
    /**
     * Factory method: Create default preferences for a new user
     * 
     * @param userId User ID (required)
     * @return New UserPreference instance with default values
     * @throws IllegalArgumentException if userId is null
     */
    public static UserPreference createDefault(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        
        UserPreference pref = new UserPreference();
        pref.userId = userId;
        pref.defaultContext = Context.SUCCESS; // Always SUCCESS (Content Context)
        pref.defaultGoalsOkrContext = GoalsOkrContext.NONE; // Default: hide Goal/Execute/Insight
        pref.createdAt = LocalDateTime.now();
        pref.updatedAt = LocalDateTime.now();
        return pref;
    }
    
    /**
     * Update context (always SUCCESS - Content Context)
     * 
     * @param context New context (must be SUCCESS)
     * @throws IllegalArgumentException if context is null or not SUCCESS
     */
    public void updateContext(Context context) {
        if (context == null) {
            throw new IllegalArgumentException("Context cannot be null");
        }
        
        // Context is always SUCCESS (Content Context)
        if (context != Context.SUCCESS) {
            throw new IllegalArgumentException("Context must always be SUCCESS (Content Context)");
        }
        
        this.defaultContext = context;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Update Goals-OKR Context
     * 
     * @param goalsOkrContext New Goals-OKR context
     * @throws IllegalArgumentException if goalsOkrContext is null
     */
    public void updateGoalsOkrContext(GoalsOkrContext goalsOkrContext) {
        if (goalsOkrContext == null) {
            throw new IllegalArgumentException("Goals-OKR context cannot be null");
        }
        this.defaultGoalsOkrContext = goalsOkrContext;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Context getDefaultContext() { return defaultContext; }
    public GoalsOkrContext getDefaultGoalsOkrContext() { return defaultGoalsOkrContext; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    /**
     * Setter for ID - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setId(Long id) { this.id = id; }
    
    /**
     * Setter for userId - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setUserId(Long userId) { this.userId = userId; }
    
    /**
     * Setter for defaultContext - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use updateContext() instead
     */
    public void setDefaultContext(Context defaultContext) { this.defaultContext = defaultContext; }
    
    /**
     * Setter for defaultGoalsOkrContext - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use updateGoalsOkrContext() instead
     */
    public void setDefaultGoalsOkrContext(GoalsOkrContext defaultGoalsOkrContext) { 
        this.defaultGoalsOkrContext = defaultGoalsOkrContext; 
    }
    
    /**
     * Setter for createdAt - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    /**
     * Setter for updatedAt - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
