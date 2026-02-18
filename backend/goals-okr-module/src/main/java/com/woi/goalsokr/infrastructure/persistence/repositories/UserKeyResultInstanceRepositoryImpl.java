package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.UserKeyResultInstance;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.UserKeyResultInstanceJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.UserKeyResultInstanceEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for UserKeyResultInstance
 */
@Repository
public class UserKeyResultInstanceRepositoryImpl implements UserKeyResultInstanceRepository {

    private final UserKeyResultInstanceJpaRepository jpaRepository;

    public UserKeyResultInstanceRepositoryImpl(UserKeyResultInstanceJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserKeyResultInstance> findById(Long id) {
        return jpaRepository.findById(id)
            .map(UserKeyResultInstanceEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserKeyResultInstance> findByUserObjectiveInstanceId(Long userObjectiveInstanceId) {
        return jpaRepository.findByUserObjectiveInstanceId(userObjectiveInstanceId).stream()
            .map(UserKeyResultInstanceEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserKeyResultInstance> findByUserObjectiveInstanceIdIn(List<Long> userObjectiveInstanceIds) {
        return jpaRepository.findByUserObjectiveInstanceIdIn(userObjectiveInstanceIds).stream()
            .map(UserKeyResultInstanceEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserKeyResultInstance> findByUserObjectiveInstanceIdAndKeyResultId(Long userObjectiveInstanceId, Long keyResultId) {
        return jpaRepository.findByUserObjectiveInstanceIdAndKeyResultId(userObjectiveInstanceId, keyResultId)
            .map(UserKeyResultInstanceEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserKeyResultInstance> findByKeyResultId(Long keyResultId) {
        return jpaRepository.findByKeyResultId(keyResultId).stream()
            .map(UserKeyResultInstanceEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserKeyResultInstance save(UserKeyResultInstance userKeyResultInstance) {
        UserKeyResultInstanceJpaEntity jpaEntity = UserKeyResultInstanceEntityMapper.toJpa(userKeyResultInstance);
        UserKeyResultInstanceJpaEntity saved = jpaRepository.save(jpaEntity);
        return UserKeyResultInstanceEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(UserKeyResultInstance userKeyResultInstance) {
        jpaRepository.deleteById(userKeyResultInstance.getId());
    }
}
