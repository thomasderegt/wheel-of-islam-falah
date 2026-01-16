package com.woi.user.domain.entities;

import com.woi.user.domain.enums.UserStatus;
import java.time.LocalDateTime;

/**
 * User domain entity - Pure POJO (no JPA annotations)
 * Contains business logic and invariants
 */
public class User {
    private Long id;
    private String email;
    private String profileName;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Private constructor
    private User() {}
    
    /**
     * Factory method: Create a new user
     * 
     * @param email User email (must be unique)
     * @return New User instance with ACTIVE status
     * @throws IllegalArgumentException if email is null or blank
     */
    public static User create(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        User user = new User();
        user.email = email.trim().toLowerCase();
        user.status = UserStatus.ACTIVE;
        user.createdAt = LocalDateTime.now();
        user.updatedAt = LocalDateTime.now();
        return user;
    }
    
    /**
     * Update email address
     * 
     * @param email New email address
     * @throws IllegalArgumentException if email is null or blank
     */
    public void updateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        this.email = email.trim().toLowerCase();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Update profile name
     * 
     * @param profileName New profile name
     */
    public void updateProfileName(String profileName) {
        this.profileName = profileName;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Block the user account
     */
    public void block() {
        this.status = UserStatus.BLOCKED;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Activate the user account
     */
    public void activate() {
        this.status = UserStatus.ACTIVE;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Delete the user account (soft delete)
     */
    public void delete() {
        this.status = UserStatus.DELETED;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getProfileName() { return profileName; }
    public UserStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
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
    
    /**
     * Setter for updatedAt - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    /**
     * Setter for status - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use business methods (block(), activate(), delete()) instead
     */
    public void setStatus(UserStatus status) { this.status = status; }
}

