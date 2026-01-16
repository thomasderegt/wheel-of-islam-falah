package com.woi.user.application.commands;

/**
 * Command for user login
 */
public record LoginCommand(
    String email,
    String password,
    String ipAddress,
    String userAgent
) {
    public LoginCommand {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
    }
}

