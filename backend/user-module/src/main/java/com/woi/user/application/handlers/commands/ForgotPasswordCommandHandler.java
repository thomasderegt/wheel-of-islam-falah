package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.ForgotPasswordCommand;
import com.woi.user.infrastructure.services.PasswordResetService;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Command handler for requesting a password reset
 * 
 * Responsibilities:
 * - Generate password reset token
 * - Send email with reset link (TODO: email service)
 */
@Component
public class ForgotPasswordCommandHandler {
    private final PasswordResetService passwordResetService;
    
    public ForgotPasswordCommandHandler(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }
    
    public void handle(ForgotPasswordCommand command) {
        // Generate reset token (returns empty if user doesn't exist - security best practice)
        Optional<String> tokenOpt = passwordResetService.generateResetToken(command.email());
        
        // TODO: Send email with reset link
        // For now, we just generate the token (email service will be added later)
        // In production, you would send an email with the reset link
        
        // Don't reveal if user exists or not (security best practice)
        // Always return success, even if user doesn't exist
    }
}

