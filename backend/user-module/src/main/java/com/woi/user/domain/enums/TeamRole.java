package com.woi.user.domain.enums;

/**
 * Team role enum
 * Defines the possible roles a user can have within a team
 */
public enum TeamRole {
    OWNER,   // Team creator, full control
    ADMIN,   // Can manage members and team settings
    MEMBER   // Regular team member
}
