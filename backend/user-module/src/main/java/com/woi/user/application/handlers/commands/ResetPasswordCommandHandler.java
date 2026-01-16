package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.ResetPasswordCommand;
import com.woi.user.domain.entities.Credential;
import com.woi.user.domain.entities.User;
import com.woi.user.domain.repositories.CredentialRepository;
import com.woi.user.domain.repositories.UserRepository;
import com.woi.user.domain.services.PasswordHasher;
import com.woi.user.infrastructure.services.PasswordResetService;
import com.woi.user.infrastructure.services.RefreshTokenService;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Command handler for resetting password with a token
 * 
 * Responsibilities:
 * - Validate reset token
 * - Update password
 * - Revoke all refresh tokens (security)
 */
@Component
public class ResetPasswordCommandHandler {
    private final PasswordResetService passwordResetService;
    private final UserRepository userRepository;
    private final CredentialRepository credentialRepository;
    private final PasswordHasher passwordHasher;
    private final RefreshTokenService refreshTokenService;
    
    public ResetPasswordCommandHandler(
            PasswordResetService passwordResetService,
            UserRepository userRepository,
            CredentialRepository credentialRepository,
            PasswordHasher passwordHasher,
            RefreshTokenService refreshTokenService) {
        this.passwordResetService = passwordResetService;
        this.userRepository = userRepository;
        this.credentialRepository = credentialRepository;
        this.passwordHasher = passwordHasher;
        this.refreshTokenService = refreshTokenService;
    }
    
    public void handle(ResetPasswordCommand command) {
        // 1. Validate reset token
        Optional<Long> userIdOpt = passwordResetService.validateResetToken(command.token());
        
        if (userIdOpt.isEmpty()) {
            throw new IllegalArgumentException("Ongeldige of verlopen reset token");
        }
        
        Long userId = userIdOpt.get();
        
        // 2. Find user
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Gebruiker niet gevonden");
        }
        
        User user = userOpt.get();
        
        // 3. Find credential
        Optional<Credential> credentialOpt = credentialRepository.findByUserId(userId);
        if (credentialOpt.isEmpty()) {
            throw new IllegalArgumentException("Credential niet gevonden");
        }
        
        Credential credential = credentialOpt.get();
        
        // 4. Create new credential with new password (domain validates and hashes)
        Credential newCredential = Credential.create(
            userId,
            command.newPassword(),  // Plain password - domain will validate and hash
            passwordHasher
        );
        
        // 5. Update credential (preserve ID)
        newCredential.setId(credential.getId());
        credentialRepository.save(newCredential);
        
        // 6. Mark token as used (one-time use)
        passwordResetService.markTokenAsUsed(command.token());
        
        // 7. Revoke all refresh tokens (security: force re-login after password change)
        refreshTokenService.revokeAllTokensForUser(userId);
    }
}

