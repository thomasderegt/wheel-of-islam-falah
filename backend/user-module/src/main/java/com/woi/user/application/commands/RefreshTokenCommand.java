package com.woi.user.application.commands;

/**
 * Command for refreshing an access token
 */
public record RefreshTokenCommand(
    String refreshToken
) {
    public RefreshTokenCommand {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new IllegalArgumentException("Refresh token cannot be null or empty");
        }
    }
}

