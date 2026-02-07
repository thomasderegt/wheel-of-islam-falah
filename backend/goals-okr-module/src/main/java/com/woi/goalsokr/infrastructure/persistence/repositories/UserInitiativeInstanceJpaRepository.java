package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.UserInitiativeInstanceJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for UserInitiativeInstanceJpaEntity
 */
@Repository
public interface UserInitiativeInstanceJpaRepository extends JpaRepository<UserInitiativeInstanceJpaEntity, Long> {
    List<UserInitiativeInstanceJpaEntity> findByUserKeyResultInstanceId(Long userKeyResultInstanceId);
    List<UserInitiativeInstanceJpaEntity> findByUserKeyResultInstanceIdIn(List<Long> userKeyResultInstanceIds);
    Optional<UserInitiativeInstanceJpaEntity> findByUserKeyResultInstanceIdAndInitiativeId(Long userKeyResultInstanceId, Long initiativeId);
}
