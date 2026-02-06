package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.KeyResult;

import java.util.List;
import java.util.Optional;

/**
 * KeyResult repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface KeyResultRepository {
    Optional<KeyResult> findById(Long id);
    List<KeyResult> findByObjectiveId(Long objectiveId);
    List<KeyResult> findByObjectiveIdOrderedByOrderIndex(Long objectiveId);
    KeyResult save(KeyResult keyResult);
    void delete(KeyResult keyResult);
}
