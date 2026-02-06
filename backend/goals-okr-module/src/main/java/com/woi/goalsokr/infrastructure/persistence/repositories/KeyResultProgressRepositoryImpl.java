package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.KeyResultProgress;
import com.woi.goalsokr.domain.repositories.KeyResultProgressRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.KeyResultProgressJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.KeyResultProgressEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for KeyResultProgress
 */
@Repository
public class KeyResultProgressRepositoryImpl implements KeyResultProgressRepository {

    private final KeyResultProgressJpaRepository jpaRepository;

    public KeyResultProgressRepositoryImpl(KeyResultProgressJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<KeyResultProgress> findById(Long id) {
        return jpaRepository.findById(id)
            .map(KeyResultProgressEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<KeyResultProgress> findByUserObjectiveInstanceId(Long userObjectiveInstanceId) {
        return jpaRepository.findByUserObjectiveInstanceId(userObjectiveInstanceId).stream()
            .map(KeyResultProgressEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<KeyResultProgress> findByKeyResultId(Long keyResultId) {
        return jpaRepository.findByKeyResultId(keyResultId).stream()
            .map(KeyResultProgressEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public KeyResultProgress save(KeyResultProgress keyResultProgress) {
        KeyResultProgressJpaEntity jpaEntity = KeyResultProgressEntityMapper.toJpa(keyResultProgress);
        KeyResultProgressJpaEntity saved = jpaRepository.save(jpaEntity);
        return KeyResultProgressEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(KeyResultProgress keyResultProgress) {
        jpaRepository.deleteById(keyResultProgress.getId());
    }
}
