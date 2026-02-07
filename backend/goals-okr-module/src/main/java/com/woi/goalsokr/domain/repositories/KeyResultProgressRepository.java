package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.KeyResultProgress;

import java.util.List;
import java.util.Optional;

/**
 * KeyResultProgress repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface KeyResultProgressRepository {
    Optional<KeyResultProgress> findById(Long id);
    List<KeyResultProgress> findByUserKeyResultInstanceId(Long userKeyResultInstanceId);
    List<KeyResultProgress> findByKeyResultId(Long keyResultId);
    KeyResultProgress save(KeyResultProgress keyResultProgress);
    void delete(KeyResultProgress keyResultProgress);
}
