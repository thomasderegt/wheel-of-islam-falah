package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.infrastructure.persistence.entities.TeamMemberJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for TeamMemberJpaEntity
 */
@Repository
public interface TeamMemberJpaRepository extends JpaRepository<TeamMemberJpaEntity, Long> {
    Optional<TeamMemberJpaEntity> findByTeamIdAndUserId(Long teamId, Long userId);
    
    List<TeamMemberJpaEntity> findByTeamId(Long teamId);
    
    @Query("SELECT tm FROM TeamMemberJpaEntity tm WHERE tm.teamId = :teamId AND tm.status = :status")
    List<TeamMemberJpaEntity> findByTeamIdAndStatus(@Param("teamId") Long teamId, @Param("status") String status);
    
    List<TeamMemberJpaEntity> findByUserId(Long userId);
    
    @Query("SELECT tm FROM TeamMemberJpaEntity tm WHERE tm.userId = :userId AND tm.status = :status")
    List<TeamMemberJpaEntity> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);
    
    boolean existsByTeamIdAndUserId(Long teamId, Long userId);
    
    @Query("SELECT COUNT(tm) > 0 FROM TeamMemberJpaEntity tm WHERE tm.teamId = :teamId AND tm.userId = :userId AND tm.status = :status")
    boolean existsByTeamIdAndUserIdAndStatus(@Param("teamId") Long teamId, @Param("userId") Long userId, @Param("status") String status);
}
