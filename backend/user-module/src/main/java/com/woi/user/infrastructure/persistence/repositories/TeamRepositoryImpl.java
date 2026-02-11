package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.entities.Team;
import com.woi.user.domain.repositories.TeamRepository;
import com.woi.user.infrastructure.persistence.entities.TeamJpaEntity;
import com.woi.user.infrastructure.persistence.mappers.TeamEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for Team
 */
@Repository
public class TeamRepositoryImpl implements TeamRepository {
    private final TeamJpaRepository jpaRepository;
    private final TeamEntityMapper mapper;
    
    public TeamRepositoryImpl(TeamJpaRepository jpaRepository, TeamEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Team> findById(Long id) {
        return jpaRepository.findById(id)
            .map(mapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Team> findByOwnerId(Long ownerId) {
        return jpaRepository.findByOwnerId(ownerId).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Team> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public Team save(Team team) {
        TeamJpaEntity jpaEntity = mapper.toJpa(team);
        TeamJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(Team team) {
        jpaRepository.deleteById(team.getId());
    }
}
