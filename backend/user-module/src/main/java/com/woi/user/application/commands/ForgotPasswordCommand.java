package com.woi.user.application.commands;

/**
 * Command for requesting a password reset
 */
public record ForgotPasswordCommand(
    String email
) {
    public ForgotPasswordCommand {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
    }
}

