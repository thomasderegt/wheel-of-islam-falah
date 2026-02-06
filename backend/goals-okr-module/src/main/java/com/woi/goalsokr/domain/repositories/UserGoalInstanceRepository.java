package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.UserGoalInstance;

import java.util.List;
import java.util.Optional;

/**
 * UserGoalInstance repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface UserGoalInstanceRepository {
    Optional<UserGoalInstance> findById(Long id);
    List<UserGoalInstance> findByUserId(Long userId);
    List<UserGoalInstance> findByGoalId(Long goalId); // Which users are subscribed to this goal?
    Optional<UserGoalInstance> findByUserIdAndGoalId(Long userId, Long goalId);
    UserGoalInstance save(UserGoalInstance userGoalInstance);
    void delete(UserGoalInstance userGoalInstance);
}
