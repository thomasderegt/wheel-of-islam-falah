package com.woi.user.infrastructure.persistence.mappers;

import com.woi.user.domain.entities.AccountLockout;
import com.woi.user.infrastructure.persistence.entities.AccountLockoutJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between AccountLockout domain entity and AccountLockoutJpaEntity
 */
@Component
public class AccountLockoutEntityMapper {
    
    public AccountLockout toDomain(AccountLockoutJpaEntity jpa) {
        if (jpa == null) return null;
        
        AccountLockout lockout = AccountLockout.create(jpa.getUserId());
        lockout.setId(jpa.getId());
        lockout.setFailedAttempts(jpa.getFailedAttempts());
        lockout.setLockedUntil(jpa.getLockedUntil());
        lockout.setCreatedAt(jpa.getCreatedAt());
        lockout.setUpdatedAt(jpa.getUpdatedAt());
        return lockout;
    }
    
    public AccountLockoutJpaEntity toJpa(AccountLockout domain) {
        if (domain == null) return null;
        
        AccountLockoutJpaEntity jpa = new AccountLockoutJpaEntity();
        jpa.setId(domain.getId());
        jpa.setUserId(domain.getUserId());
        jpa.setFailedAttempts(domain.getFailedAttempts());
        jpa.setLockedUntil(domain.getLockedUntil());
        jpa.setCreatedAt(domain.getCreatedAt());
        jpa.setUpdatedAt(domain.getUpdatedAt());
        return jpa;
    }
}

