package com.woi.user.domain.services;

/**
 * Password validator - Domain layer
 * Pure Java class (no Spring dependencies)
 * Validates password strength according to security requirements
 */
public class PasswordValidator {
    
    private static final int MIN_LENGTH = 8;
    private static final int MAX_LENGTH = 128; // Reasonable maximum
    
    /**
     * Validate password strength
     * 
     * Rules:
     * - Minimum 8 characters
     * - Maximum 128 characters
     * 
     * @param password Password to validate
     * @throws IllegalArgumentException if password is invalid
     */
    public void validate(String password) {
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Wachtwoord is verplicht");
        }
        
        if (password.length() < MIN_LENGTH) {
            throw new IllegalArgumentException(
                String.format("Wachtwoord moet minimaal %d tekens lang zijn", MIN_LENGTH)
            );
        }
        
        if (password.length() > MAX_LENGTH) {
            throw new IllegalArgumentException(
                String.format("Wachtwoord mag maximaal %d tekens lang zijn", MAX_LENGTH)
            );
        }
        
        // Optional: Check for common weak passwords
        // For now, we just check length
    }
}

