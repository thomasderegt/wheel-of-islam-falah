package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.entities.TeamKanbanShare;
import com.woi.user.domain.repositories.TeamKanbanShareRepository;
import com.woi.user.infrastructure.persistence.entities.TeamKanbanShareJpaEntity;
import com.woi.user.infrastructure.persistence.mappers.TeamKanbanShareEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Repository implementation for TeamKanbanShare
 */
@Repository
public class TeamKanbanShareRepositoryImpl implements TeamKanbanShareRepository {
    private final TeamKanbanShareJpaRepository jpaRepository;
    private final TeamKanbanShareEntityMapper mapper;
    
    public TeamKanbanShareRepositoryImpl(
            TeamKanbanShareJpaRepository jpaRepository,
            TeamKanbanShareEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<TeamKanbanShare> findById(Long id) {
        return jpaRepository.findById(id)
            .map(mapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<TeamKanbanShare> findActiveByTeamId(Long teamId) {
        return jpaRepository.findActiveByTeamId(teamId)
            .map(mapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsActiveByTeamId(Long teamId) {
        return jpaRepository.existsActiveByTeamId(teamId);
    }
    
    @Override
    @Transactional
    public TeamKanbanShare save(TeamKanbanShare share) {
        TeamKanbanShareJpaEntity jpaEntity = mapper.toJpa(share);
        TeamKanbanShareJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(TeamKanbanShare share) {
        jpaRepository.deleteById(share.getId());
    }
}
