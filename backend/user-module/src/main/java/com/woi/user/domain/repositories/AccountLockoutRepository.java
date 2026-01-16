package com.woi.user.domain.repositories;

import com.woi.user.domain.entities.AccountLockout;
import java.util.Optional;

/**
 * AccountLockout repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface AccountLockoutRepository {
    Optional<AccountLockout> findById(Long id);
    Optional<AccountLockout> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    AccountLockout save(AccountLockout accountLockout);
    void delete(AccountLockout accountLockout);
}

