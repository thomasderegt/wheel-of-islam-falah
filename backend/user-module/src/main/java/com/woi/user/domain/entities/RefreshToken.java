package com.woi.user.domain.entities;

import java.time.LocalDateTime;

/**
 * RefreshToken domain entity - Pure POJO (no JPA annotations)
 * Long-lived tokens (7 days) used to obtain new access tokens
 */
public class RefreshToken {
    private Long id;
    private Long userId;  // Soft reference
    private String tokenHash;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime revokedAt;
    
    // Private constructor
    private RefreshToken() {}
    
    /**
     * Factory method: Create a new refresh token
     * 
     * @param userId User ID for whom the token is created
     * @param tokenHash Hashed token value
     * @param expiresAt Expiration time (typically 7 days from now)
     * @throws IllegalArgumentException if userId, tokenHash, or expiresAt is null
     */
    public static RefreshToken create(Long userId, String tokenHash, LocalDateTime expiresAt) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (tokenHash == null || tokenHash.trim().isEmpty()) {
            throw new IllegalArgumentException("Token hash cannot be null or empty");
        }
        if (expiresAt == null) {
            throw new IllegalArgumentException("Expires at cannot be null");
        }
        
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.userId = userId;
        refreshToken.tokenHash = tokenHash;
        refreshToken.expiresAt = expiresAt;
        refreshToken.createdAt = LocalDateTime.now();
        refreshToken.revokedAt = null;
        return refreshToken;
    }
    
    /**
     * Revoke this token
     */
    public void revoke() {
        this.revokedAt = LocalDateTime.now();
    }
    
    /**
     * Check if token is valid (not expired and not revoked)
     * 
     * @return true if token is valid, false otherwise
     */
    public boolean isValid() {
        if (revokedAt != null) {
            return false; // Token has been revoked
        }
        
        return LocalDateTime.now().isBefore(expiresAt);
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getTokenHash() { return tokenHash; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getRevokedAt() { return revokedAt; }
    
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
     * Setter for revokedAt - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use revoke() method instead
     */
    public void setRevokedAt(LocalDateTime revokedAt) { this.revokedAt = revokedAt; }
}

