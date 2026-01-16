package com.woi.user.infrastructure.services;

import com.woi.user.domain.entities.AccountLockout;
import com.woi.user.domain.entities.User;
import com.woi.user.domain.repositories.AccountLockoutRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service for managing account lockout
 * Handles failed login attempts and account locking
 */
@Service
public class AccountLockoutService {
    
    private final AccountLockoutRepository lockoutRepository;
    
    public AccountLockoutService(AccountLockoutRepository lockoutRepository) {
        this.lockoutRepository = lockoutRepository;
    }
    
    /**
     * Check if user account is locked
     */
    @Transactional(readOnly = true)
    public boolean isAccountLocked(User user) {
        Optional<AccountLockout> lockoutOpt = lockoutRepository.findByUserId(user.getId());
        
        if (lockoutOpt.isEmpty()) {
            return false; // No lockout record, account is not locked
        }
        
        AccountLockout lockout = lockoutOpt.get();
        return lockout.isLocked();
    }
    
    /**
     * Record a failed login attempt
     * Locks account after 5 failed attempts
     */
    @Transactional
    public void recordFailedLogin(User user) {
        Optional<AccountLockout> lockoutOpt = lockoutRepository.findByUserId(user.getId());
        
        AccountLockout lockout;
        if (lockoutOpt.isPresent()) {
            lockout = lockoutOpt.get();
        } else {
            lockout = AccountLockout.create(user.getId());
        }
        
        lockout.recordFailedAttempt();
        lockoutRepository.save(lockout);
    }
    
    /**
     * Reset failed login attempts (on successful login)
     */
    @Transactional
    public void resetFailedAttempts(User user) {
        Optional<AccountLockout> lockoutOpt = lockoutRepository.findByUserId(user.getId());
        
        if (lockoutOpt.isPresent()) {
            AccountLockout lockout = lockoutOpt.get();
            lockout.resetFailedAttempts();
            lockoutRepository.save(lockout);
        }
    }
    
    /**
     * Get time until account unlock (in seconds)
     */
    @Transactional(readOnly = true)
    public long getSecondsUntilUnlock(User user) {
        Optional<AccountLockout> lockoutOpt = lockoutRepository.findByUserId(user.getId());
        
        if (lockoutOpt.isEmpty()) {
            return 0;
        }
        
        AccountLockout lockout = lockoutOpt.get();
        return lockout.getSecondsUntilUnlock();
    }
}

