package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.UserKeyResult;

import java.util.List;
import java.util.Optional;

/**
 * UserKeyResult repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface UserKeyResultRepository {
    Optional<UserKeyResult> findById(Long id);
    List<UserKeyResult> findByUserId(Long userId);
    List<UserKeyResult> findByUserObjectiveId(Long userObjectiveId);
    List<UserKeyResult> findByUserObjectiveIdOrderedByCreatedAtDesc(Long userObjectiveId);
    UserKeyResult save(UserKeyResult userKeyResult);
    void delete(UserKeyResult userKeyResult);
}
