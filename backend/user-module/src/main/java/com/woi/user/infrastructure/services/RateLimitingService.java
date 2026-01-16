package com.woi.user.infrastructure.services;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate Limiting Service
 * Prevents brute force attacks by limiting request frequency
 * 
 * Rules:
 * - Login: 5 attempts per 15 minutes per IP
 * - Register: 3 attempts per hour per IP
 */
@Service
public class RateLimitingService {
    
    private static class AttemptRecord {
        int count;
        LocalDateTime firstAttempt;
        LocalDateTime windowStart;
        
        AttemptRecord() {
            this.count = 1;
            this.firstAttempt = LocalDateTime.now();
            this.windowStart = LocalDateTime.now();
        }
    }
    
    // In-memory storage: IP -> AttemptRecord
    // In production, consider using Redis for distributed systems
    private final Map<String, AttemptRecord> loginAttempts = new ConcurrentHashMap<>();
    private final Map<String, AttemptRecord> registerAttempts = new ConcurrentHashMap<>();
    
    // Rate limits
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOGIN_WINDOW_MINUTES = 15;
    private static final int MAX_REGISTER_ATTEMPTS = 3;
    private static final int REGISTER_WINDOW_HOURS = 1;
    
    /**
     * Check if login attempt is allowed
     */
    public boolean isLoginAllowed(String ipAddress) {
        return checkRateLimit(ipAddress, loginAttempts, MAX_LOGIN_ATTEMPTS, LOGIN_WINDOW_MINUTES);
    }
    
    /**
     * Check if registration attempt is allowed
     */
    public boolean isRegisterAllowed(String ipAddress) {
        return checkRateLimit(ipAddress, registerAttempts, MAX_REGISTER_ATTEMPTS, REGISTER_WINDOW_HOURS * 60);
    }
    
    /**
     * Record a login attempt
     */
    public void recordLoginAttempt(String ipAddress) {
        recordAttempt(ipAddress, loginAttempts, LOGIN_WINDOW_MINUTES);
    }
    
    /**
     * Record a registration attempt
     */
    public void recordRegisterAttempt(String ipAddress) {
        recordAttempt(ipAddress, registerAttempts, REGISTER_WINDOW_HOURS * 60);
    }
    
    /**
     * Reset rate limit for an IP (e.g., after successful login)
     */
    public void resetLoginAttempts(String ipAddress) {
        loginAttempts.remove(ipAddress);
    }
    
    /**
     * Get time until rate limit resets (in seconds)
     */
    public long getTimeUntilReset(String ipAddress, boolean isLogin) {
        Map<String, AttemptRecord> attempts = isLogin ? loginAttempts : registerAttempts;
        AttemptRecord record = attempts.get(ipAddress);
        if (record == null) {
            return 0;
        }
        
        LocalDateTime windowEnd = record.windowStart.plusMinutes(isLogin ? LOGIN_WINDOW_MINUTES : REGISTER_WINDOW_HOURS * 60);
        long seconds = java.time.Duration.between(LocalDateTime.now(), windowEnd).getSeconds();
        return Math.max(0, seconds);
    }
    
    /**
     * Get remaining login attempts
     */
    public int getRemainingLoginAttempts(String ipAddress) {
        AttemptRecord record = loginAttempts.get(ipAddress);
        if (record == null) {
            return MAX_LOGIN_ATTEMPTS;
        }
        return Math.max(0, MAX_LOGIN_ATTEMPTS - record.count);
    }
    
    private boolean checkRateLimit(String ipAddress, Map<String, AttemptRecord> attempts, int maxAttempts, int windowMinutes) {
        AttemptRecord record = attempts.get(ipAddress);
        if (record == null) {
            return true; // No previous attempts
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowEnd = record.windowStart.plusMinutes(windowMinutes);
        
        // Check if window has expired
        if (now.isAfter(windowEnd)) {
            attempts.remove(ipAddress);
            return true; // Window expired, allow attempt
        }
        
        // Check if limit exceeded
        return record.count < maxAttempts;
    }
    
    private void recordAttempt(String ipAddress, Map<String, AttemptRecord> attempts, int windowMinutes) {
        AttemptRecord record = attempts.get(ipAddress);
        LocalDateTime now = LocalDateTime.now();
        
        if (record == null) {
            record = new AttemptRecord();
            attempts.put(ipAddress, record);
        } else {
            LocalDateTime windowEnd = record.windowStart.plusMinutes(windowMinutes);
            
            // Reset if window expired
            if (now.isAfter(windowEnd)) {
                record = new AttemptRecord();
                attempts.put(ipAddress, record);
            } else {
                record.count++;
            }
        }
    }
}

