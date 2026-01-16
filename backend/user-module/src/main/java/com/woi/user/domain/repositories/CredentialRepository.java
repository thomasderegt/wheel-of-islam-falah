package com.woi.user.domain.repositories;

import com.woi.user.domain.entities.Credential;
import java.util.Optional;

/**
 * Credential repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface CredentialRepository {
    Optional<Credential> findById(Long id);
    Optional<Credential> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    Credential save(Credential credential);
    void delete(Credential credential);
}

