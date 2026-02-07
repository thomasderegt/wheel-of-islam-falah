package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.UserInitiativeJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for UserInitiativeJpaEntity
 */
@Repository
public interface UserInitiativeJpaRepository extends JpaRepository<UserInitiativeJpaEntity, Long> {
    
    List<UserInitiativeJpaEntity> findByUserId(Long userId);
    
    List<UserInitiativeJpaEntity> findByUserKeyResultInstanceId(Long userKeyResultInstanceId);
    
    List<UserInitiativeJpaEntity> findByKeyResultId(Long keyResultId);
    
    List<UserInitiativeJpaEntity> findByUserIdAndKeyResultId(
        @Param("userId") Long userId,
        @Param("keyResultId") Long keyResultId
    );
    
    List<UserInitiativeJpaEntity> findByUserIdAndStatus(
        @Param("userId") Long userId,
        @Param("status") String status
    );
}
