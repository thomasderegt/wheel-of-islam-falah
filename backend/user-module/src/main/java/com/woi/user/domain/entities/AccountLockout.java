package com.woi.user.domain.entities;

import java.time.LocalDateTime;

/**
 * AccountLockout domain entity - Pure POJO (no JPA annotations)
 * Tracks failed login attempts and lockout status per user
 */
public class AccountLockout {
    private Long id;
    private Long userId;  // Soft reference
    private int failedAttempts;
    private LocalDateTime lockedUntil;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Private constructor
    private AccountLockout() {}
    
    /**
     * Factory method: Create a new account lockout record
     * 
     * @param userId User ID
     * @return New AccountLockout instance
     * @throws IllegalArgumentException if userId is null
     */
    public static AccountLockout create(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        
        AccountLockout lockout = new AccountLockout();
        lockout.userId = userId;
        lockout.failedAttempts = 0;
        lockout.lockedUntil = null;
        lockout.createdAt = LocalDateTime.now();
        lockout.updatedAt = LocalDateTime.now();
        return lockout;
    }
    
    /**
     * Record a failed login attempt
     * Locks account after 5 failed attempts for 30 minutes
     */
    public void recordFailedAttempt() {
        this.failedAttempts++;
        this.updatedAt = LocalDateTime.now();
        
        // Lock account after 5 failed attempts
        if (this.failedAttempts >= 5) {
            this.lockedUntil = LocalDateTime.now().plusMinutes(30);
        }
    }
    
    /**
     * Reset failed attempts (on successful login)
     */
    public void resetFailedAttempts() {
        this.failedAttempts = 0;
        this.lockedUntil = null;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Check if account is currently locked
     * 
     * @return true if account is locked, false otherwise
     */
    public boolean isLocked() {
        if (lockedUntil == null) {
            return false;
        }
        
        // Check if lockout has expired
        if (LocalDateTime.now().isAfter(lockedUntil)) {
            // Lockout expired, reset
            this.failedAttempts = 0;
            this.lockedUntil = null;
            this.updatedAt = LocalDateTime.now();
            return false;
        }
        
        return true;
    }
    
    /**
     * Get time until lockout expires (in seconds)
     * 
     * @return seconds until unlock, or 0 if not locked
     */
    public long getSecondsUntilUnlock() {
        if (lockedUntil == null) {
            return 0;
        }
        
        long seconds = java.time.Duration.between(LocalDateTime.now(), lockedUntil).getSeconds();
        return Math.max(0, seconds);
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public int getFailedAttempts() { return failedAttempts; }
    public LocalDateTime getLockedUntil() { return lockedUntil; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    /**
     * Setter for ID - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setId(Long id) { this.id = id; }
    
    /**
     * Setter for failedAttempts - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use recordFailedAttempt() method instead
     */
    public void setFailedAttempts(int failedAttempts) { this.failedAttempts = failedAttempts; }
    
    /**
     * Setter for lockedUntil - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setLockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; }
    
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

