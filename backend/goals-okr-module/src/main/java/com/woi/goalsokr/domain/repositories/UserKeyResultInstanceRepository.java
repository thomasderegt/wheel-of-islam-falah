package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.UserKeyResultInstance;

import java.util.List;
import java.util.Optional;

/**
 * UserKeyResultInstance repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface UserKeyResultInstanceRepository {
    Optional<UserKeyResultInstance> findById(Long id);
    List<UserKeyResultInstance> findByUserObjectiveInstanceId(Long userObjectiveInstanceId);
    List<UserKeyResultInstance> findByUserObjectiveInstanceIdIn(List<Long> userObjectiveInstanceIds);
    Optional<UserKeyResultInstance> findByUserObjectiveInstanceIdAndKeyResultId(Long userObjectiveInstanceId, Long keyResultId);
    UserKeyResultInstance save(UserKeyResultInstance userKeyResultInstance);
    void delete(UserKeyResultInstance userKeyResultInstance);
}
