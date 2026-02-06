package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.enums.GoalStatus;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.InitiativeJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.InitiativeEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for Initiative
 */
@Repository
public class InitiativeRepositoryImpl implements InitiativeRepository {

    private final InitiativeJpaRepository jpaRepository;

    public InitiativeRepositoryImpl(InitiativeJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Initiative> findById(Long id) {
        return jpaRepository.findById(id)
            .map(InitiativeEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Initiative> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
            .map(InitiativeEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Initiative> findByUserObjectiveInstanceId(Long userObjectiveInstanceId) {
        return jpaRepository.findByUserObjectiveInstanceId(userObjectiveInstanceId).stream()
            .map(InitiativeEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Initiative> findByKeyResultId(Long keyResultId) {
        return jpaRepository.findByKeyResultId(keyResultId).stream()
            .map(InitiativeEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Initiative> findByUserIdAndKeyResultId(Long userId, Long keyResultId) {
        return jpaRepository.findByUserIdAndKeyResultId(userId, keyResultId).stream()
            .map(InitiativeEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Initiative> findByUserIdAndStatus(Long userId, GoalStatus status) {
        return jpaRepository.findByUserIdAndStatus(userId, status.name()).stream()
            .map(InitiativeEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Initiative save(Initiative initiative) {
        InitiativeJpaEntity jpaEntity = InitiativeEntityMapper.toJpa(initiative);
        InitiativeJpaEntity saved = jpaRepository.save(jpaEntity);
        return InitiativeEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(Initiative initiative) {
        jpaRepository.deleteById(initiative.getId());
    }
}
