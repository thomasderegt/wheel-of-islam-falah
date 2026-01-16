package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.LoginCommand;
import com.woi.user.application.results.AuthResult;
import com.woi.user.application.ports.output.JwtTokenService;
import com.woi.user.domain.entities.Credential;
import com.woi.user.domain.entities.User;
import com.woi.user.domain.enums.UserStatus;
import com.woi.user.domain.repositories.CredentialRepository;
import com.woi.user.domain.repositories.UserRepository;
import com.woi.user.domain.services.PasswordHasher;
import com.woi.user.infrastructure.services.AccountLockoutService;
import com.woi.user.infrastructure.services.AuditLogService;
import com.woi.user.infrastructure.services.RefreshTokenService;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Command handler for user login
 * 
 * Responsibilities:
 * - Orchestrate user authentication flow
 * - Coordinate domain entities and repositories
 * - Generate authentication tokens
 * - Handle account lockout and audit logging
 */
@Component
public class LoginCommandHandler {
    private final UserRepository userRepository;
    private final CredentialRepository credentialRepository;
    private final PasswordHasher passwordHasher;
    private final JwtTokenService jwtTokenService;
    private final RefreshTokenService refreshTokenService;
    private final AccountLockoutService accountLockoutService;
    private final AuditLogService auditLogService;
    
    public LoginCommandHandler(
            UserRepository userRepository,
            CredentialRepository credentialRepository,
            PasswordHasher passwordHasher,
            JwtTokenService jwtTokenService,
            RefreshTokenService refreshTokenService,
            AccountLockoutService accountLockoutService,
            AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.credentialRepository = credentialRepository;
        this.passwordHasher = passwordHasher;
        this.jwtTokenService = jwtTokenService;
        this.refreshTokenService = refreshTokenService;
        this.accountLockoutService = accountLockoutService;
        this.auditLogService = auditLogService;
    }
    
    public AuthResult handle(LoginCommand command) {
        // 1. Find user
        Optional<User> userOpt = userRepository.findByEmail(command.email().toLowerCase());
        if (userOpt.isEmpty()) {
            // Don't reveal that user doesn't exist (security best practice)
            auditLogService.logLoginFailure(null, command.ipAddress(), command.userAgent(), "User not found");
            throw new IllegalArgumentException("Ongeldige email of wachtwoord");
        }
        
        User user = userOpt.get();
        
        // 2. Check if account is locked
        if (accountLockoutService.isAccountLocked(user)) {
            long secondsUntilUnlock = accountLockoutService.getSecondsUntilUnlock(user);
            auditLogService.logAccountLocked(user.getId(), command.ipAddress(), command.userAgent());
            throw new IllegalArgumentException(
                String.format("Account is geblokkeerd. Probeer het over %d minuten opnieuw.", 
                    (secondsUntilUnlock / 60) + 1)
            );
        }
        
        // 3. Check if user is active
        if (user.getStatus() != UserStatus.ACTIVE) {
            auditLogService.logLoginFailure(user.getId(), command.ipAddress(), command.userAgent(), "Account not active");
            throw new IllegalArgumentException("Account is niet actief");
        }
        
        // 4. Find credential
        Optional<Credential> credentialOpt = credentialRepository.findByUserId(user.getId());
        if (credentialOpt.isEmpty()) {
            accountLockoutService.recordFailedLogin(user);
            auditLogService.logLoginFailure(user.getId(), command.ipAddress(), command.userAgent(), "No credential found");
            throw new IllegalArgumentException("Ongeldige email of wachtwoord");
        }
        
        Credential credential = credentialOpt.get();
        
        // 5. Verify password
        if (!passwordHasher.verify(command.password(), credential.getPasswordHash())) {
            accountLockoutService.recordFailedLogin(user);
            auditLogService.logLoginFailure(user.getId(), command.ipAddress(), command.userAgent(), "Invalid password");
            throw new IllegalArgumentException("Ongeldige email of wachtwoord");
        }
        
        // 6. Successful login - reset failed attempts
        accountLockoutService.resetFailedAttempts(user);
        
        // 7. Audit logging
        auditLogService.logLoginSuccess(user.getId(), command.ipAddress(), command.userAgent());
        
        // 8. Generate access token
        String token = jwtTokenService.generateToken(user.getId(), user.getEmail());
        LocalDateTime expiresAt = jwtTokenService.getExpirationTime(token);
        
        // 9. Generate refresh token
        String refreshToken = refreshTokenService.generateRefreshToken(user.getId());
        
        return new AuthResult(token, refreshToken, user.getId(), user.getEmail(), expiresAt);
    }
}

