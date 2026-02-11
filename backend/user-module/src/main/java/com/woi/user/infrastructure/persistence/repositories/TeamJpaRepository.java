package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.infrastructure.persistence.entities.TeamJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for TeamJpaEntity
 */
@Repository
public interface TeamJpaRepository extends JpaRepository<TeamJpaEntity, Long> {
    List<TeamJpaEntity> findByOwnerId(Long ownerId);
    
    @Query("SELECT DISTINCT t FROM TeamJpaEntity t " +
           "JOIN TeamMemberJpaEntity tm ON tm.teamId = t.id " +
           "WHERE tm.userId = :userId AND tm.status = 'ACTIVE'")
    List<TeamJpaEntity> findByUserId(@Param("userId") Long userId);
}
