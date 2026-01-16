package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.RefreshTokenCommand;
import com.woi.user.application.results.AuthResult;
import com.woi.user.application.ports.output.JwtTokenService;
import com.woi.user.domain.entities.User;
import com.woi.user.domain.enums.UserStatus;
import com.woi.user.domain.repositories.UserRepository;
import com.woi.user.infrastructure.services.RefreshTokenService;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Command handler for refreshing an access token
 * 
 * Responsibilities:
 * - Validate refresh token
 * - Generate new access token
 * - Return new authentication result
 */
@Component
public class RefreshTokenCommandHandler {
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final JwtTokenService jwtTokenService;
    
    public RefreshTokenCommandHandler(
            RefreshTokenService refreshTokenService,
            UserRepository userRepository,
            JwtTokenService jwtTokenService) {
        this.refreshTokenService = refreshTokenService;
        this.userRepository = userRepository;
        this.jwtTokenService = jwtTokenService;
    }
    
    public AuthResult handle(RefreshTokenCommand command) {
        // 1. Validate refresh token
        Optional<Long> userIdOpt = refreshTokenService.validateRefreshToken(command.refreshToken());
        
        if (userIdOpt.isEmpty()) {
            throw new IllegalArgumentException("Ongeldige of verlopen refresh token");
        }
        
        Long userId = userIdOpt.get();
        
        // 2. Find user
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Gebruiker niet gevonden");
        }
        
        User user = userOpt.get();
        
        // 3. Check if user is active
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalArgumentException("Account is niet actief");
        }
        
        // 4. Generate new access token
        String token = jwtTokenService.generateToken(user.getId(), user.getEmail());
        LocalDateTime expiresAt = jwtTokenService.getExpirationTime(token);
        
        // 5. Return new access token (refresh token remains the same)
        return new AuthResult(token, command.refreshToken(), user.getId(), user.getEmail(), expiresAt);
    }
}

