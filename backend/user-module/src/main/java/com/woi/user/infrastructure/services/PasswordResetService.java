package com.woi.user.infrastructure.services;

import com.woi.user.domain.entities.PasswordResetToken;
import com.woi.user.domain.repositories.PasswordResetTokenRepository;
import com.woi.user.domain.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing password reset tokens
 * Handles generation, validation, and usage of password reset tokens
 */
@Service
public class PasswordResetService {
    
    private static final int RESET_TOKEN_EXPIRATION_HOURS = 1;
    
    private final PasswordResetTokenRepository resetTokenRepository;
    private final UserRepository userRepository;
    
    public PasswordResetService(
            PasswordResetTokenRepository resetTokenRepository,
            UserRepository userRepository) {
        this.resetTokenRepository = resetTokenRepository;
        this.userRepository = userRepository;
    }
    
    /**
     * Generate a password reset token for a user
     * Revokes any existing active tokens for the user
     * 
     * @param email User email
     * @return Plain text reset token (should be sent via email, never stored)
     */
    @Transactional
    public Optional<String> generateResetToken(String email) {
        Optional<com.woi.user.domain.entities.User> userOpt = userRepository.findByEmail(email.toLowerCase());
        
        if (userOpt.isEmpty()) {
            // Don't reveal that user doesn't exist (security best practice)
            return Optional.empty();
        }
        
        com.woi.user.domain.entities.User user = userOpt.get();
        
        // Revoke any existing active tokens for this user
        resetTokenRepository.revokeAllActiveTokensByUserId(user.getId());
        
        // Generate a random UUID-based token
        String plainToken = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
        
        // Hash the token before storing using SHA-256 (deterministic, for lookup)
        String tokenHash = hashToken(plainToken);
        
        // Calculate expiration (1 hour from now)
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(RESET_TOKEN_EXPIRATION_HOURS);
        
        // Create and save reset token
        PasswordResetToken resetToken = PasswordResetToken.create(user.getId(), tokenHash, expiresAt);
        resetTokenRepository.save(resetToken);
        
        // Return plain token (will be sent via email)
        return Optional.of(plainToken);
    }
    
    /**
     * Validate a password reset token and return the associated user ID
     * 
     * @param plainToken Plain text reset token from client
     * @return User ID if token is valid, empty otherwise
     */
    @Transactional
    public Optional<Long> validateResetToken(String plainToken) {
        if (plainToken == null || plainToken.isEmpty()) {
            return Optional.empty();
        }
        
        String tokenHash = hashToken(plainToken);
        Optional<PasswordResetToken> tokenOpt = resetTokenRepository.findByTokenHash(tokenHash);
        
        if (tokenOpt.isEmpty()) {
            return Optional.empty();
        }
        
        PasswordResetToken token = tokenOpt.get();
        
        // Check if token is valid (not expired, not used)
        if (!token.isValid()) {
            return Optional.empty();
        }
        
        return Optional.of(token.getUserId());
    }
    
    /**
     * Mark a reset token as used (one-time use)
     */
    @Transactional
    public void markTokenAsUsed(String plainToken) {
        String tokenHash = hashToken(plainToken);
        Optional<PasswordResetToken> tokenOpt = resetTokenRepository.findByTokenHash(tokenHash);
        
        if (tokenOpt.isPresent()) {
            PasswordResetToken token = tokenOpt.get();
            token.markAsUsed();
            resetTokenRepository.save(token);
        }
    }
    
    /**
     * Hash a reset token using SHA-256 (deterministic, for lookup)
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

