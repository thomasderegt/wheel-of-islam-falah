package com.woi.user.application.commands;

/**
 * Command for registering a new user
 */
public record RegisterUserCommand(
    String email,
    String password,
    String ipAddress,
    String userAgent
) {
    public RegisterUserCommand {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
    }
}

