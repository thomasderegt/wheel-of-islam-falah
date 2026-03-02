package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.entities.FalahCycle;
import com.woi.user.domain.repositories.FalahCycleRepository;
import com.woi.user.infrastructure.persistence.entities.FalahCycleJpaEntity;
import com.woi.user.infrastructure.persistence.mappers.FalahCycleEntityMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for FalahCycle
 */
@Repository
public class FalahCycleRepositoryImpl implements FalahCycleRepository {
    private final FalahCycleJpaRepository jpaRepository;
    private final FalahCycleEntityMapper mapper;

    public FalahCycleRepositoryImpl(FalahCycleJpaRepository jpaRepository, FalahCycleEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<FalahCycle> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<FalahCycle> findByUserId(Long userId) {
        return jpaRepository.findByUserIdOrderByStartedAtDesc(userId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<FalahCycle> findActiveByUserId(Long userId) {
        return jpaRepository.findByUserIdAndCompletedAtIsNullOrderByStartedAtDesc(userId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public FalahCycle save(FalahCycle falahCycle) {
        FalahCycleJpaEntity jpaEntity = mapper.toJpa(falahCycle);
        FalahCycleJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomain(saved);
    }

    @Override
    public void delete(FalahCycle falahCycle) {
        jpaRepository.deleteById(falahCycle.getId());
    }
}
