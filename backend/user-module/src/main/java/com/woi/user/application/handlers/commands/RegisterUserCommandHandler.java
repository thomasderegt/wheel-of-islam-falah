package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.RegisterUserCommand;
import com.woi.user.application.results.UserResult;
import com.woi.user.domain.entities.Credential;
import com.woi.user.domain.entities.User;
import com.woi.user.domain.repositories.CredentialRepository;
import com.woi.user.domain.repositories.UserRepository;
import com.woi.user.domain.services.PasswordHasher;
import com.woi.user.infrastructure.services.AuditLogService;
import org.springframework.stereotype.Component;

/**
 * Command handler for registering a new user
 * 
 * Responsibilities:
 * - Orchestrate user registration flow
 * - Coordinate domain entities and repositories
 * - Handle cross-cutting concerns (audit logging)
 */
@Component
public class RegisterUserCommandHandler {
    private final UserRepository userRepository;
    private final CredentialRepository credentialRepository;
    private final PasswordHasher passwordHasher;
    private final AuditLogService auditLogService;
    
    public RegisterUserCommandHandler(
            UserRepository userRepository,
            CredentialRepository credentialRepository,
            PasswordHasher passwordHasher,
            AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.credentialRepository = credentialRepository;
        this.passwordHasher = passwordHasher;
        this.auditLogService = auditLogService;
    }
    
    public UserResult handle(RegisterUserCommand command) {
        // 1. Check if email exists (orchestration)
        if (userRepository.findByEmail(command.email()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        // 2. Create domain entity (domain factory method - validates email)
        User user = User.create(command.email());
        
        // 3. Save user first to get ID
        User savedUser = userRepository.save(user);
        
        // 4. Create credential (domain factory method - validates and hashes password)
        Credential credential = Credential.create(
            savedUser.getId(), 
            command.password(),  // Plain password - domain will validate and hash
            passwordHasher       // Infrastructure service via interface
        );
        
        // 5. Save credential
        credentialRepository.save(credential);
        
        // 6. Audit logging (cross-cutting concern)
        auditLogService.logRegistration(
            savedUser.getId(), 
            command.ipAddress(), 
            command.userAgent()
        );
        
        // 7. Return result
        return UserResult.from(savedUser);
    }
}

