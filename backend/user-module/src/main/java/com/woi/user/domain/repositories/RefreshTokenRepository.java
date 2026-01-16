package com.woi.user.domain.repositories;

import com.woi.user.domain.entities.RefreshToken;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * RefreshToken repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface RefreshTokenRepository {
    Optional<RefreshToken> findById(Long id);
    Optional<RefreshToken> findByTokenHash(String tokenHash);
    List<RefreshToken> findByUserId(Long userId);
    RefreshToken save(RefreshToken refreshToken);
    void delete(RefreshToken refreshToken);
    
    /**
     * Revoke all refresh tokens for a user
     * 
     * @param userId User ID
     * @return Number of tokens revoked
     */
    int revokeAllByUserId(Long userId);
    
    /**
     * Delete expired tokens
     * 
     * @param now Current time
     * @return Number of tokens deleted
     */
    int deleteExpiredTokens(LocalDateTime now);
}

