package com.woi.user.domain.entities;

import java.time.LocalDateTime;

/**
 * PasswordResetToken domain entity - Pure POJO (no JPA annotations)
 * Temporary tokens for password reset flow (expires after 1 hour, one-time use)
 */
public class PasswordResetToken {
    private Long id;
    private Long userId;  // Soft reference
    private String tokenHash;
    private LocalDateTime expiresAt;
    private LocalDateTime usedAt;
    private LocalDateTime createdAt;
    
    // Private constructor
    private PasswordResetToken() {}
    
    /**
     * Factory method: Create a new password reset token
     * 
     * @param userId User ID for whom the token is created
     * @param tokenHash Hashed token value
     * @param expiresAt Expiration time (typically 1 hour from now)
     * @throws IllegalArgumentException if userId, tokenHash, or expiresAt is null
     */
    public static PasswordResetToken create(Long userId, String tokenHash, LocalDateTime expiresAt) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (tokenHash == null || tokenHash.trim().isEmpty()) {
            throw new IllegalArgumentException("Token hash cannot be null or empty");
        }
        if (expiresAt == null) {
            throw new IllegalArgumentException("Expires at cannot be null");
        }
        
        PasswordResetToken token = new PasswordResetToken();
        token.userId = userId;
        token.tokenHash = tokenHash;
        token.expiresAt = expiresAt;
        token.createdAt = LocalDateTime.now();
        token.usedAt = null;
        return token;
    }
    
    /**
     * Mark token as used (one-time use)
     */
    public void markAsUsed() {
        this.usedAt = LocalDateTime.now();
    }
    
    /**
     * Check if token is valid (not expired, not used)
     * 
     * @return true if token is valid, false otherwise
     */
    public boolean isValid() {
        if (usedAt != null) {
            return false; // Token has been used
        }
        
        return LocalDateTime.now().isBefore(expiresAt);
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getTokenHash() { return tokenHash; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public LocalDateTime getUsedAt() { return usedAt; }
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
    
    /**
     * Setter for usedAt - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use markAsUsed() method instead
     */
    public void setUsedAt(LocalDateTime usedAt) { this.usedAt = usedAt; }
}

