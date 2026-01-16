package com.woi.user.domain.repositories;

import com.woi.user.domain.entities.PasswordResetToken;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * PasswordResetToken repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface PasswordResetTokenRepository {
    Optional<PasswordResetToken> findById(Long id);
    Optional<PasswordResetToken> findByTokenHash(String tokenHash);
    List<PasswordResetToken> findActiveTokensByUserId(Long userId, LocalDateTime now);
    PasswordResetToken save(PasswordResetToken token);
    void delete(PasswordResetToken token);
    
    /**
     * Revoke all active tokens for a user
     * 
     * @param userId User ID
     * @return Number of tokens revoked
     */
    int revokeAllActiveTokensByUserId(Long userId);
    
    /**
     * Delete expired tokens
     * 
     * @param now Current time
     * @return Number of tokens deleted
     */
    int deleteExpiredTokens(LocalDateTime now);
}

