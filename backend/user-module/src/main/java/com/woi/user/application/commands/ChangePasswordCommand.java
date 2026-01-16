package com.woi.user.application.commands;

/**
 * Command for changing password (when logged in)
 */
public record ChangePasswordCommand(
    Long userId,
    String oldPassword,
    String newPassword
) {
    public ChangePasswordCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (oldPassword == null || oldPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Old password cannot be null or empty");
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("New password cannot be null or empty");
        }
    }
}

