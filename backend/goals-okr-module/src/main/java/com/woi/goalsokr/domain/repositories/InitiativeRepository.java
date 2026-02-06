package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.enums.GoalStatus;

import java.util.List;
import java.util.Optional;

/**
 * Initiative repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface InitiativeRepository {
    Optional<Initiative> findById(Long id);
    List<Initiative> findByUserId(Long userId);
    List<Initiative> findByUserObjectiveInstanceId(Long userObjectiveInstanceId);
    List<Initiative> findByKeyResultId(Long keyResultId);
    List<Initiative> findByUserIdAndKeyResultId(Long userId, Long keyResultId);
    List<Initiative> findByUserIdAndStatus(Long userId, GoalStatus status);
    Initiative save(Initiative initiative);
    void delete(Initiative initiative);
}
