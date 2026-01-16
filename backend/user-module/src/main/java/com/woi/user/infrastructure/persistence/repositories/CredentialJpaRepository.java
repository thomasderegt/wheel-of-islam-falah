package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.infrastructure.persistence.entities.CredentialJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for CredentialJpaEntity
 */
@Repository
public interface CredentialJpaRepository extends JpaRepository<CredentialJpaEntity, Long> {
    Optional<CredentialJpaEntity> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}

