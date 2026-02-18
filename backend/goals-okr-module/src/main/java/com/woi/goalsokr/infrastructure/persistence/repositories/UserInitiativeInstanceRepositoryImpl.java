package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.UserInitiativeInstance;
import com.woi.goalsokr.domain.repositories.UserInitiativeInstanceRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.UserInitiativeInstanceJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.UserInitiativeInstanceEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for UserInitiativeInstance
 */
@Repository
public class UserInitiativeInstanceRepositoryImpl implements UserInitiativeInstanceRepository {

    private final UserInitiativeInstanceJpaRepository jpaRepository;

    public UserInitiativeInstanceRepositoryImpl(UserInitiativeInstanceJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserInitiativeInstance> findById(Long id) {
        return jpaRepository.findById(id)
            .map(UserInitiativeInstanceEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserInitiativeInstance> findByUserKeyResultInstanceId(Long userKeyResultInstanceId) {
        return jpaRepository.findByUserKeyResultInstanceId(userKeyResultInstanceId).stream()
            .map(UserInitiativeInstanceEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserInitiativeInstance> findByUserKeyResultInstanceIdIn(List<Long> userKeyResultInstanceIds) {
        return jpaRepository.findByUserKeyResultInstanceIdIn(userKeyResultInstanceIds).stream()
            .map(UserInitiativeInstanceEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserInitiativeInstance> findByUserKeyResultInstanceIdAndInitiativeId(Long userKeyResultInstanceId, Long initiativeId) {
        return jpaRepository.findByUserKeyResultInstanceIdAndInitiativeId(userKeyResultInstanceId, initiativeId)
            .map(UserInitiativeInstanceEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserInitiativeInstance> findByInitiativeId(Long initiativeId) {
        return jpaRepository.findByInitiativeId(initiativeId).stream()
            .map(UserInitiativeInstanceEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserInitiativeInstance save(UserInitiativeInstance userInitiativeInstance) {
        UserInitiativeInstanceJpaEntity jpaEntity = UserInitiativeInstanceEntityMapper.toJpa(userInitiativeInstance);
        UserInitiativeInstanceJpaEntity saved = jpaRepository.save(jpaEntity);
        return UserInitiativeInstanceEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(UserInitiativeInstance userInitiativeInstance) {
        jpaRepository.deleteById(userInitiativeInstance.getId());
    }
}
