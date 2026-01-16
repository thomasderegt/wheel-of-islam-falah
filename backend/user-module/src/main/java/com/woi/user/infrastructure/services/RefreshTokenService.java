package com.woi.user.infrastructure.services;

import com.woi.user.domain.entities.RefreshToken;
import com.woi.user.domain.repositories.RefreshTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing refresh tokens
 * Handles generation, validation, and revocation of refresh tokens
 */
@Service
public class RefreshTokenService {
    
    private static final int REFRESH_TOKEN_EXPIRATION_DAYS = 7;
    
    private final RefreshTokenRepository refreshTokenRepository;
    
    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }
    
    /**
     * Generate a new refresh token for a user
     * 
     * @param userId User ID for whom the token is generated
     * @return Plain text refresh token (should be sent to client, never stored)
     */
    @Transactional
    public String generateRefreshToken(Long userId) {
        // Generate a random UUID-based token
        String plainToken = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
        
        // Hash the token before storing using SHA-256 (deterministic, for lookup)
        String tokenHash = hashToken(plainToken);
        
        // Calculate expiration (7 days from now)
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(REFRESH_TOKEN_EXPIRATION_DAYS);
        
        // Create and save refresh token
        RefreshToken refreshToken = RefreshToken.create(userId, tokenHash, expiresAt);
        refreshTokenRepository.save(refreshToken);
        
        // Return plain token (client will store this)
        return plainToken;
    }
    
    /**
     * Validate a refresh token and return the associated user ID
     * 
     * @param plainToken Plain text refresh token from client
     * @return User ID if token is valid, empty otherwise
     */
    @Transactional
    public Optional<Long> validateRefreshToken(String plainToken) {
        if (plainToken == null || plainToken.isEmpty()) {
            return Optional.empty();
        }
        
        // Hash the token and look it up
        String tokenHash = hashToken(plainToken);
        
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByTokenHash(tokenHash);
        
        if (tokenOpt.isEmpty()) {
            return Optional.empty();
        }
        
        RefreshToken token = tokenOpt.get();
        
        // Check if token is valid (not expired, not revoked)
        if (!token.isValid()) {
            return Optional.empty();
        }
        
        return Optional.of(token.getUserId());
    }
    
    /**
     * Revoke a refresh token
     */
    @Transactional
    public void revokeRefreshToken(String plainToken) {
        String tokenHash = hashToken(plainToken);
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByTokenHash(tokenHash);
        
        if (tokenOpt.isPresent()) {
            RefreshToken token = tokenOpt.get();
            token.revoke();
            refreshTokenRepository.save(token);
        }
    }
    
    /**
     * Revoke all refresh tokens for a user (e.g., on logout or password change)
     */
    @Transactional
    public void revokeAllTokensForUser(Long userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
    }
    
    /**
     * Hash a refresh token using SHA-256 (deterministic, for lookup)
     * Note: This is different from password hashing (BCrypt) which is non-deterministic
     */
    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
    
    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}

