package com.woi.user.domain.entities;

import com.woi.user.domain.enums.UserRole;
import java.time.LocalDateTime;

/**
 * UserRoleAssignment domain entity - Pure POJO (no JPA annotations)
 * Represents a role assignment for a user
 * 
 * A user can have multiple roles (e.g., USER + CONTENT_CREATOR)
 * Each role assignment is stored as a separate record
 */
public class UserRoleAssignment {
    private Long id;
    private Long userId;  // Soft reference
    private UserRole role;
    private LocalDateTime createdAt;
    
    // Private constructor
    private UserRoleAssignment() {}
    
    /**
     * Factory method: Create a new role assignment
     * 
     * @param userId User ID
     * @param role Role to assign
     * @return New UserRoleAssignment instance
     * @throws IllegalArgumentException if userId or role is null
     */
    public static UserRoleAssignment create(Long userId, UserRole role) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (role == null) {
            throw new IllegalArgumentException("Role cannot be null");
        }
        
        UserRoleAssignment assignment = new UserRoleAssignment();
        assignment.userId = userId;
        assignment.role = role;
        assignment.createdAt = LocalDateTime.now();
        return assignment;
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public UserRole getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    /**
     * Setter for ID - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setId(Long id) { this.id = id; }
    
    /**
     * Setter for createdAt - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

