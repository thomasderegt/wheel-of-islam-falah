package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.UserInitiative;
import com.woi.goalsokr.domain.enums.GoalStatus;

import java.util.List;
import java.util.Optional;

/**
 * UserInitiative repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface UserInitiativeRepository {
    Optional<UserInitiative> findById(Long id);
    List<UserInitiative> findByUserId(Long userId);
    List<UserInitiative> findByUserKeyResultInstanceId(Long userKeyResultInstanceId);
    List<UserInitiative> findByKeyResultId(Long keyResultId);
    List<UserInitiative> findByUserIdAndKeyResultId(Long userId, Long keyResultId);
    List<UserInitiative> findByUserIdAndStatus(Long userId, GoalStatus status);
    UserInitiative save(UserInitiative initiative);
    void delete(UserInitiative initiative);
}
