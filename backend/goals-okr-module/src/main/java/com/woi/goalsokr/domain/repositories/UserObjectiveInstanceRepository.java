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
    List<UserObjectiveInstance> findByUserGoalInstanceId(Long userGoalInstanceId);
    List<UserObjectiveInstance> findByUserGoalInstanceIdIn(List<Long> userGoalInstanceIds);
    Optional<UserObjectiveInstance> findByUserGoalInstanceIdAndObjectiveId(Long userGoalInstanceId, Long objectiveId);
    UserObjectiveInstance save(UserObjectiveInstance userObjectiveInstance);
    void delete(UserObjectiveInstance userObjectiveInstance);
}
