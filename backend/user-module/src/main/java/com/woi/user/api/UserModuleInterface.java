package com.woi.user.api;

import java.util.Optional;

/**
 * Public interface for User module
 * This is the contract that other modules can use to interact with users
 * 
 * v1 Scope:
 * - User queries (by ID, by email)
 * - User validation (exists, is active)
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
}
