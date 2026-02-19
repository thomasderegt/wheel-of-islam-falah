package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.KeyResult;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.KeyResultJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.KeyResultEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for KeyResult
 */
@Repository
public class KeyResultRepositoryImpl implements KeyResultRepository {

    private final KeyResultJpaRepository jpaRepository;

    public KeyResultRepositoryImpl(KeyResultJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<KeyResult> findById(Long id) {
        return jpaRepository.findById(id)
            .map(KeyResultEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<KeyResult> findByObjectiveId(Long objectiveId) {
        return jpaRepository.findByObjectiveId(objectiveId).stream()
            .map(KeyResultEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<KeyResult> findByObjectiveIdOrderedByOrderIndex(Long objectiveId) {
        return jpaRepository.findByObjectiveIdOrderedByOrderIndex(objectiveId).stream()
            .map(KeyResultEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<KeyResult> findByObjectiveIdAndUserFilteredOrderedByOrderIndex(Long objectiveId, Long userId) {
        return jpaRepository.findByObjectiveIdAndUserFilteredOrderedByOrderIndex(objectiveId, userId).stream()
            .map(KeyResultEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public KeyResult save(KeyResult keyResult) {
        KeyResultJpaEntity jpaEntity = KeyResultEntityMapper.toJpa(keyResult);
        KeyResultJpaEntity saved = jpaRepository.save(jpaEntity);
        return KeyResultEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(KeyResult keyResult) {
        jpaRepository.deleteById(keyResult.getId());
    }
}
