package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.Goal;
import com.woi.goalsokr.domain.repositories.GoalRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.GoalJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.GoalEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for Goal
 */
@Repository
public class GoalRepositoryImpl implements GoalRepository {

    private final GoalJpaRepository jpaRepository;

    public GoalRepositoryImpl(GoalJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Goal> findById(Long id) {
        return jpaRepository.findById(id)
            .map(GoalEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Goal> findByLifeDomainId(Long lifeDomainId) {
        return jpaRepository.findByLifeDomainId(lifeDomainId).stream()
            .map(GoalEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Goal> findByLifeDomainIdOrderedByOrderIndex(Long lifeDomainId) {
        return jpaRepository.findByLifeDomainIdOrderedByOrderIndex(lifeDomainId).stream()
            .map(GoalEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Goal save(Goal goal) {
        GoalJpaEntity jpaEntity = GoalEntityMapper.toJpa(goal);
        GoalJpaEntity saved = jpaRepository.save(jpaEntity);
        return GoalEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(Goal goal) {
        jpaRepository.deleteById(goal.getId());
    }
}
