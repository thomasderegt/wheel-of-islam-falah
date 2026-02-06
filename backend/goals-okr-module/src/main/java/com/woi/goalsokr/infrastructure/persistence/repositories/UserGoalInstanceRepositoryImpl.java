package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.UserGoalInstance;
import com.woi.goalsokr.domain.repositories.UserGoalInstanceRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.UserGoalInstanceJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.UserGoalInstanceEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for UserGoalInstance
 */
@Repository
public class UserGoalInstanceRepositoryImpl implements UserGoalInstanceRepository {

    private final UserGoalInstanceJpaRepository jpaRepository;

    public UserGoalInstanceRepositoryImpl(UserGoalInstanceJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserGoalInstance> findById(Long id) {
        return jpaRepository.findById(id)
            .map(UserGoalInstanceEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserGoalInstance> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
            .map(UserGoalInstanceEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserGoalInstance> findByGoalId(Long goalId) {
        return jpaRepository.findByGoalId(goalId).stream()
            .map(UserGoalInstanceEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserGoalInstance> findByUserIdAndGoalId(Long userId, Long goalId) {
        return jpaRepository.findByUserIdAndGoalId(userId, goalId)
            .map(UserGoalInstanceEntityMapper::toDomain);
    }

    @Override
    @Transactional
    public UserGoalInstance save(UserGoalInstance userGoalInstance) {
        UserGoalInstanceJpaEntity jpaEntity = UserGoalInstanceEntityMapper.toJpa(userGoalInstance);
        UserGoalInstanceJpaEntity saved = jpaRepository.save(jpaEntity);
        return UserGoalInstanceEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(UserGoalInstance userGoalInstance) {
        jpaRepository.deleteById(userGoalInstance.getId());
    }
}
