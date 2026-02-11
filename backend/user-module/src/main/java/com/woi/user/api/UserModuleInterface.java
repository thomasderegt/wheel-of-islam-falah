package com.woi.user.api;

import java.util.Optional;

/**
 * Public interface for User module
 * This is the contract that other modules can use to interact with users
 * 
 * v1 Scope:
 * - User queries (by ID, by email)
 * - User validation (exists, is active)
 * - User preferences (get, update)
 */
public interface UserModuleInterface {
    
    /**
     * Get a user by ID
     * @param userId User ID
     * @return Optional containing the user summary if found
     */
    Optional<UserSummary> getUserById(Long userId);
    
    /**
     * Get a user by email
     * @param email User email
     * @return Optional containing the user summary if found
     */
    Optional<UserSummary> getUserByEmail(String email);
    
    /**
     * Check if a user exists
     * Used by other modules to validate userId references
     * @param userId User ID
     * @return true if user exists, false otherwise
     */
    boolean userExists(Long userId);
    
    /**
     * Check if a user is active
     * Used by other modules to validate user status
     * @param userId User ID
     * @return true if user exists and is ACTIVE, false otherwise
     */
    boolean isUserActive(Long userId);
    
    /**
     * Get user preferences by user ID
     * Creates default preferences if they don't exist
     * @param userId User ID
     * @return User preference summary (never null - creates default if missing)
     */
    UserPreferenceSummary getUserPreferences(Long userId);
    
    /**
     * Update user preferences
     * Creates preferences if they don't exist
     * @param userId User ID
     * @param defaultContext Default context (always SUCCESS - Content Context)
     * @param defaultGoalsOkrContext Default Goals-OKR context (can be null, defaults to NONE)
     * @return Updated user preference summary
     */
    UserPreferenceSummary updateUserPreferences(Long userId, com.woi.user.domain.enums.Context defaultContext, com.woi.user.domain.enums.GoalsOkrContext defaultGoalsOkrContext);
    
    /**
     * Get teams for a user
     * @param userId User ID
     * @return List of team summaries where user is a member
     */
    java.util.List<TeamSummary> getTeamsByUserId(Long userId);
    
    /**
     * Check if user is team member
     * @param userId User ID
     * @param teamId Team ID
     * @return true if user is active member of team
     */
    boolean isUserTeamMember(Long userId, Long teamId);
    
    /**
     * Get user's role in team
     * @param userId User ID
     * @param teamId Team ID
     * @return Optional containing role if user is member
     */
    java.util.Optional<String> getUserTeamRole(Long userId, Long teamId);
    
    /**
     * Get team owner ID
     * @param teamId Team ID
     * @return Optional containing owner ID if team exists
     */
    java.util.Optional<Long> getTeamOwnerId(Long teamId);
    
    /**
     * Get team kanban share owner user ID (if shared)
     * @param teamId Team ID
     * @return Optional containing owner user ID if kanban board is shared
     */
    java.util.Optional<Long> getTeamKanbanShareOwnerId(Long teamId);
}
