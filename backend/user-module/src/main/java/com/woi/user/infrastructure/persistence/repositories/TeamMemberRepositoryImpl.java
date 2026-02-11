package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.entities.TeamMember;
import com.woi.user.domain.enums.TeamMemberStatus;
import com.woi.user.domain.repositories.TeamMemberRepository;
import com.woi.user.infrastructure.persistence.entities.TeamMemberJpaEntity;
import com.woi.user.infrastructure.persistence.mappers.TeamMemberEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for TeamMember
 */
@Repository
public class TeamMemberRepositoryImpl implements TeamMemberRepository {
    private final TeamMemberJpaRepository jpaRepository;
    private final TeamMemberEntityMapper mapper;
    
    public TeamMemberRepositoryImpl(TeamMemberJpaRepository jpaRepository, TeamMemberEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<TeamMember> findById(Long id) {
        return jpaRepository.findById(id)
            .map(mapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<TeamMember> findByTeamIdAndUserId(Long teamId, Long userId) {
        return jpaRepository.findByTeamIdAndUserId(teamId, userId)
            .map(mapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeamMember> findByTeamId(Long teamId) {
        return jpaRepository.findByTeamId(teamId).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeamMember> findByTeamIdAndStatus(Long teamId, TeamMemberStatus status) {
        return jpaRepository.findByTeamIdAndStatus(teamId, status.name()).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeamMember> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TeamMember> findByUserIdAndStatus(Long userId, TeamMemberStatus status) {
        return jpaRepository.findByUserIdAndStatus(userId, status.name()).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByTeamIdAndUserId(Long teamId, Long userId) {
        return jpaRepository.existsByTeamIdAndUserId(teamId, userId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByTeamIdAndUserIdAndStatus(Long teamId, Long userId, TeamMemberStatus status) {
        return jpaRepository.existsByTeamIdAndUserIdAndStatus(teamId, userId, status.name());
    }
    
    @Override
    @Transactional
    public TeamMember save(TeamMember member) {
        TeamMemberJpaEntity jpaEntity = mapper.toJpa(member);
        TeamMemberJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(TeamMember member) {
        jpaRepository.deleteById(member.getId());
    }
}
