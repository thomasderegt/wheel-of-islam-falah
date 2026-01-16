package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.ChangePasswordCommand;
import com.woi.user.domain.entities.Credential;
import com.woi.user.domain.repositories.CredentialRepository;
import com.woi.user.domain.services.PasswordHasher;
import com.woi.user.infrastructure.services.AuditLogService;
import com.woi.user.infrastructure.services.RefreshTokenService;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Command handler for changing password (when logged in)
 * 
 * Responsibilities:
 * - Verify old password
 * - Update password
 * - Revoke all refresh tokens (security)
 * - Audit logging
 */
@Component
public class ChangePasswordCommandHandler {
    private final CredentialRepository credentialRepository;
    private final PasswordHasher passwordHasher;
    private final RefreshTokenService refreshTokenService;
    private final AuditLogService auditLogService;
    
    public ChangePasswordCommandHandler(
            CredentialRepository credentialRepository,
            PasswordHasher passwordHasher,
            RefreshTokenService refreshTokenService,
            AuditLogService auditLogService) {
        this.credentialRepository = credentialRepository;
        this.passwordHasher = passwordHasher;
        this.refreshTokenService = refreshTokenService;
        this.auditLogService = auditLogService;
    }
    
    public void handle(ChangePasswordCommand command) {
        // 1. Find credential
        Optional<Credential> credentialOpt = credentialRepository.findByUserId(command.userId());
        if (credentialOpt.isEmpty()) {
            throw new IllegalArgumentException("Credential niet gevonden");
        }
        
        Credential credential = credentialOpt.get();
        
        // 2. Verify old password
        if (!passwordHasher.verify(command.oldPassword(), credential.getPasswordHash())) {
            throw new IllegalArgumentException("Oud wachtwoord is onjuist");
        }
        
        // 3. Create new credential with new password (domain validates and hashes)
        Credential newCredential = Credential.create(
            command.userId(),
            command.newPassword(),  // Plain password - domain will validate and hash
            passwordHasher
        );
        
        // 4. Update credential (preserve ID)
        newCredential.setId(credential.getId());
        credentialRepository.save(newCredential);
        
        // 5. Revoke all refresh tokens (security: force re-login after password change)
        refreshTokenService.revokeAllTokensForUser(command.userId());
        
        // 6. Audit logging
        // Note: IP and user agent should be passed in command for audit logging
        auditLogService.logPasswordChange(command.userId(), null, null);
    }
}

