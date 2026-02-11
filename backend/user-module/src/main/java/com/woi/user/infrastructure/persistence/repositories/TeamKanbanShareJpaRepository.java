package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.infrastructure.persistence.entities.TeamKanbanShareJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for TeamKanbanShareJpaEntity
 */
@Repository
public interface TeamKanbanShareJpaRepository extends JpaRepository<TeamKanbanShareJpaEntity, Long> {
    @Query("SELECT tks FROM TeamKanbanShareJpaEntity tks WHERE tks.teamId = :teamId AND tks.unsharedAt IS NULL")
    Optional<TeamKanbanShareJpaEntity> findActiveByTeamId(@Param("teamId") Long teamId);
    
    @Query("SELECT COUNT(tks) > 0 FROM TeamKanbanShareJpaEntity tks WHERE tks.teamId = :teamId AND tks.unsharedAt IS NULL")
    boolean existsActiveByTeamId(@Param("teamId") Long teamId);
}
