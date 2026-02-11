package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.entities.TeamInvitation;
import com.woi.user.domain.repositories.TeamInvitationRepository;
import com.woi.user.infrastructure.persistence.entities.TeamInvitationJpaEntity;
import com.woi.user.infrastructure.persistence.mappers.TeamInvitationEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for TeamInvitation
 */
@Repository
public class TeamInvitationRepositoryImpl implements TeamInvitationRepository {
    private final TeamInvitationJpaRepository jpaRepository;
    private final TeamInvitationEntityMapper mapper;
    
    public TeamInvitationRepositoryImpl(TeamInvitationJpaRepository jpaRepository, TeamInvitationEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<TeamInvitation> findById(Long id) {
        return jpaRepository.findById(id)
            .map(mapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<TeamInvitation> findByToken(String token) {
        return jpaRepository.findByToken(token)
            .map(mapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeamInvitation> findByTeamId(Long teamId) {
        return jpaRepository.findByTeamId(teamId).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeamInvitation> findByEmail(String email) {
        return jpaRepository.findByEmail(email).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeamInvitation> findByTeamIdAndEmail(Long teamId, String email) {
        return jpaRepository.findByTeamIdAndEmail(teamId, email).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public TeamInvitation save(TeamInvitation invitation) {
        TeamInvitationJpaEntity jpaEntity = mapper.toJpa(invitation);
        TeamInvitationJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(TeamInvitation invitation) {
        jpaRepository.deleteById(invitation.getId());
    }
}
