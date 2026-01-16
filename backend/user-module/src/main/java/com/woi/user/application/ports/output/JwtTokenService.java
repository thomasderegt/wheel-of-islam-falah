package com.woi.user.application.ports.output;

import java.time.LocalDateTime;

/**
 * JWT Token Service interface - Output port
 * Implementation will be in infrastructure layer
 */
public interface JwtTokenService {
    /**
     * Generate JWT token for a user
     * 
     * @param userId User ID
     * @param email User email
     * @return JWT token string
     */
    String generateToken(Long userId, String email);
    
    /**
     * Validate and extract user ID from token
     * 
     * @param token JWT token
     * @return User ID
     * @throws IllegalArgumentException if token is invalid
     */
    Long validateToken(String token);
    
    /**
     * Get expiration time for a token
     * 
     * @param token JWT token
     * @return Expiration time
     */
    LocalDateTime getExpirationTime(String token);
}

