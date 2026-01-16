package com.woi.user.application.commands;

/**
 * Command for resetting password with a token
 */
public record ResetPasswordCommand(
    String token,
    String newPassword
) {
    public ResetPasswordCommand {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token cannot be null or empty");
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("New password cannot be null or empty");
        }
    }
}

