package com.woi.user.application.results;

import java.time.LocalDateTime;

/**
 * Authentication result
 * Contains access token, refresh token, user ID, email, roles, and expiration time
 * 
 * Note: UserSummary will be added later when security module is implemented
 */
public record AuthResult(
    String token,              // Access token (short-lived, 15 minutes)
    String refreshToken,      // Refresh token (long-lived, 7 days)
    Long userId,
    String email,
    LocalDateTime expiresAt
) {}

