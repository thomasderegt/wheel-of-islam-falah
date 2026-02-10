package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.infrastructure.persistence.entities.UserPreferenceJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for UserPreferenceJpaEntity
 */
@Repository
public interface UserPreferenceJpaRepository extends JpaRepository<UserPreferenceJpaEntity, Long> {
    Optional<UserPreferenceJpaEntity> findByUserId(Long userId);
}
