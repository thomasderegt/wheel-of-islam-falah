package com.woi.user.domain.entities;

import com.woi.user.domain.services.PasswordHasher;
import java.time.LocalDateTime;

/**
 * Credential domain entity - Pure POJO (no JPA annotations)
 * Stores user password hashes
 */
public class Credential {
    private Long id;
    private Long userId;  // Soft reference (geen directe User reference)
    private String passwordHash;
    private LocalDateTime passwordUpdatedAt;
    
    // Private constructor
    private Credential() {}
    
    /**
     * Factory method: Create a new credential with plain password
     * 
     * This method validates the password and hashes it internally.
     * Business rules are enforced here (domain concern).
     * 
     * @param userId User ID
     * @param plainPassword Plain text password (will be validated and hashed)
     * @param passwordHasher Password hasher service (infrastructure dependency via interface)
     * @return New Credential instance
     * @throws IllegalArgumentException if userId is null, password is null/empty, or password is too short
     */
    public static Credential create(Long userId, String plainPassword, PasswordHasher passwordHasher) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (plainPassword == null || plainPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        if (plainPassword.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        if (plainPassword.length() > 128) {
            throw new IllegalArgumentException("Password must be at most 128 characters long");
        }
        if (passwordHasher == null) {
            throw new IllegalArgumentException("Password hasher cannot be null");
        }
        
        // Hash password (infrastructure service via interface)
        String passwordHash = passwordHasher.hash(plainPassword);
        
        Credential credential = new Credential();
        credential.userId = userId;
        credential.passwordHash = passwordHash;
        credential.passwordUpdatedAt = LocalDateTime.now();
        return credential;
    }
    
    /**
     * Factory method: Create a new credential with already hashed password
     * 
     * Use this method when loading from database (password is already hashed).
     * 
     * @param userId User ID
     * @param passwordHash BCrypt hash of the password
     * @return New Credential instance
     * @throws IllegalArgumentException if userId or passwordHash is null
     */
    public static Credential createFromHash(Long userId, String passwordHash) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (passwordHash == null || passwordHash.trim().isEmpty()) {
            throw new IllegalArgumentException("Password hash cannot be null or empty");
        }
        
        Credential credential = new Credential();
        credential.userId = userId;
        credential.passwordHash = passwordHash;
        credential.passwordUpdatedAt = LocalDateTime.now();
        return credential;
    }
    
    /**
     * Update password hash
     * 
     * Note: Password should already be hashed before calling this method
     * 
     * @param newPasswordHash New password hash (BCrypt)
     * @throws IllegalArgumentException if passwordHash is null or empty
     */
    public void updatePassword(String newPasswordHash) {
        if (newPasswordHash == null || newPasswordHash.trim().isEmpty()) {
            throw new IllegalArgumentException("Password hash cannot be null or empty");
        }
        this.passwordHash = newPasswordHash;
        this.passwordUpdatedAt = LocalDateTime.now();
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getPasswordHash() { return passwordHash; }
    public LocalDateTime getPasswordUpdatedAt() { return passwordUpdatedAt; }
    
    /**
     * Setter for ID - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setId(Long id) { this.id = id; }
    
    /**
     * Setter for passwordUpdatedAt - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setPasswordUpdatedAt(LocalDateTime passwordUpdatedAt) {
        this.passwordUpdatedAt = passwordUpdatedAt;
    }
}

