package com.woi.user.infrastructure.persistence.entities;

import com.woi.user.domain.enums.Context;
import com.woi.user.domain.enums.GoalsOkrContext;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for UserPreference
 * Maps to database table users.user_preferences
 */
@Entity
@Table(name = "user_preferences", schema = "users")
public class UserPreferenceJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId; // FK to users.users
    
    @Enumerated(EnumType.STRING)
    @Column(name = "default_context", nullable = false, length = 20)
    private Context defaultContext;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "default_goals_okr_context", nullable = false, length = 20)
    private GoalsOkrContext defaultGoalsOkrContext;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Public constructor - JPA requirement
    public UserPreferenceJpaEntity() {}
    
    // Getters and setters
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
