package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.UserObjective;

import java.util.List;
import java.util.Optional;

/**
 * UserObjective repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface UserObjectiveRepository {
    Optional<UserObjective> findById(Long id);
    List<UserObjective> findByUserId(Long userId);
    List<UserObjective> findByUserGoalId(Long userGoalId);
    List<UserObjective> findByUserGoalIdOrderedByCreatedAtDesc(Long userGoalId);
    UserObjective save(UserObjective userObjective);
    void delete(UserObjective userObjective);
}
