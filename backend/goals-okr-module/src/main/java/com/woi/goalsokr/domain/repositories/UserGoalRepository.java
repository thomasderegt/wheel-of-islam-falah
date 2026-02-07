package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.UserGoal;

import java.util.List;
import java.util.Optional;

/**
 * UserGoal repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface UserGoalRepository {
    Optional<UserGoal> findById(Long id);
    List<UserGoal> findByUserId(Long userId);
    List<UserGoal> findByUserIdOrderedByCreatedAtDesc(Long userId);
    List<UserGoal> findByUserIdAndLifeDomainId(Long userId, Long lifeDomainId);
    UserGoal save(UserGoal userGoal);
    void delete(UserGoal userGoal);
}
