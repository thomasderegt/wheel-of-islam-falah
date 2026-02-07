package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.UserKeyResult;
import com.woi.goalsokr.domain.repositories.UserKeyResultRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.UserKeyResultJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.UserKeyResultEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for UserKeyResult
 */
@Repository
public class UserKeyResultRepositoryImpl implements UserKeyResultRepository {

    private final UserKeyResultJpaRepository jpaRepository;

    public UserKeyResultRepositoryImpl(UserKeyResultJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserKeyResult> findById(Long id) {
        return jpaRepository.findById(id)
            .map(UserKeyResultEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserKeyResult> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
            .map(UserKeyResultEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserKeyResult> findByUserObjectiveId(Long userObjectiveId) {
        return jpaRepository.findByUserObjectiveId(userObjectiveId).stream()
            .map(UserKeyResultEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserKeyResult> findByUserObjectiveIdOrderedByCreatedAtDesc(Long userObjectiveId) {
        return jpaRepository.findByUserObjectiveIdOrderedByCreatedAtDesc(userObjectiveId).stream()
            .map(UserKeyResultEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserKeyResult save(UserKeyResult userKeyResult) {
        UserKeyResultJpaEntity jpaEntity = UserKeyResultEntityMapper.toJpa(userKeyResult);
        UserKeyResultJpaEntity saved = jpaRepository.save(jpaEntity);
        return UserKeyResultEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(UserKeyResult userKeyResult) {
        jpaRepository.deleteById(userKeyResult.getId());
    }
}
