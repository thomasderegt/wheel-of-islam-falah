package com.woi.user.domain.services;

/**
 * PasswordHasher interface - Domain layer
 * Interface for password hashing operations
 * 
 * Implementation will be in infrastructure layer (BcryptPasswordHasher)
 */
public interface PasswordHasher {
    /**
     * Hash a plain text password
     * 
     * @param plainPassword Plain text password
     * @return Hashed password
     * @throws IllegalArgumentException if password is null or empty
     */
    String hash(String plainPassword);
    
    /**
     * Verify a plain text password against a hash
     * 
     * @param plainPassword Plain text password to verify
     * @param hash Hashed password to compare against
     * @return true if password matches hash, false otherwise
     */
    boolean verify(String plainPassword, String hash);
}

