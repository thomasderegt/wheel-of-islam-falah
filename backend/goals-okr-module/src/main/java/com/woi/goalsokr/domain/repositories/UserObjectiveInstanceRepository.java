package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.UserObjectiveInstance;

import java.util.List;
import java.util.Optional;

/**
 * UserObjectiveInstance repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface UserObjectiveInstanceRepository {
    Optional<UserObjectiveInstance> findById(Long id);
    List<UserObjectiveInstance> findByUserId(Long userId);
    Optional<UserObjectiveInstance> findByUserIdAndObjectiveId(Long userId, Long objectiveId);
    List<UserObjectiveInstance> findByObjectiveId(Long objectiveId);
    UserObjectiveInstance save(UserObjectiveInstance userObjectiveInstance);
    void delete(UserObjectiveInstance userObjectiveInstance);
}
