package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.UserInitiativeInstance;

import java.util.List;
import java.util.Optional;

/**
 * UserInitiativeInstance repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface UserInitiativeInstanceRepository {
    Optional<UserInitiativeInstance> findById(Long id);
    List<UserInitiativeInstance> findByUserKeyResultInstanceId(Long userKeyResultInstanceId);
    List<UserInitiativeInstance> findByUserKeyResultInstanceIdIn(List<Long> userKeyResultInstanceIds);
    Optional<UserInitiativeInstance> findByUserKeyResultInstanceIdAndInitiativeId(Long userKeyResultInstanceId, Long initiativeId);
    UserInitiativeInstance save(UserInitiativeInstance userInitiativeInstance);
    void delete(UserInitiativeInstance userInitiativeInstance);
}
