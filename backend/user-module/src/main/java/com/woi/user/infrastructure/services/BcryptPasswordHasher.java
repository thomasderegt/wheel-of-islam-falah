package com.woi.user.infrastructure.services;

import com.woi.user.domain.services.PasswordHasher;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * BCrypt password hasher implementation
 * Implements PasswordHasher interface from domain layer
 */
@Component
public class BcryptPasswordHasher implements PasswordHasher {
    
    private final PasswordEncoder encoder;
    
    public BcryptPasswordHasher() {
        // BCrypt with strength 10 (default, good balance between security and performance)
        this.encoder = new BCryptPasswordEncoder();
    }
    
    @Override
    public String hash(String plainPassword) {
        if (plainPassword == null || plainPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        return encoder.encode(plainPassword);
    }
    
    @Override
    public boolean verify(String plainPassword, String hash) {
        if (plainPassword == null || hash == null) {
            return false;
        }
        return encoder.matches(plainPassword, hash);
    }
}

