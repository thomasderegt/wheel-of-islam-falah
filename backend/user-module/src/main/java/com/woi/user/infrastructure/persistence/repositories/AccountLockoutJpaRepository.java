package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.infrastructure.persistence.entities.AccountLockoutJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for AccountLockoutJpaEntity
 */
@Repository
public interface AccountLockoutJpaRepository extends JpaRepository<AccountLockoutJpaEntity, Long> {
    Optional<AccountLockoutJpaEntity> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}

