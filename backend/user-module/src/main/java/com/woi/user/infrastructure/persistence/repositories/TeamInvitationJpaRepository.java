package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.infrastructure.persistence.entities.TeamInvitationJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for TeamInvitationJpaEntity
 */
@Repository
public interface TeamInvitationJpaRepository extends JpaRepository<TeamInvitationJpaEntity, Long> {
    Optional<TeamInvitationJpaEntity> findByToken(String token);
    
    List<TeamInvitationJpaEntity> findByTeamId(Long teamId);
    
    List<TeamInvitationJpaEntity> findByEmail(String email);
    
    @Query("SELECT ti FROM TeamInvitationJpaEntity ti WHERE ti.teamId = :teamId AND ti.email = :email")
    List<TeamInvitationJpaEntity> findByTeamIdAndEmail(@Param("teamId") Long teamId, @Param("email") String email);
}
