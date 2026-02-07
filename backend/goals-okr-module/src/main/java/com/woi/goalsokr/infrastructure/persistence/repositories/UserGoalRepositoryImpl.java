package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.UserGoal;
import com.woi.goalsokr.domain.repositories.UserGoalRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.UserGoalJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.UserGoalEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for UserGoal
 */
@Repository
public class UserGoalRepositoryImpl implements UserGoalRepository {

    private final UserGoalJpaRepository jpaRepository;

    public UserGoalRepositoryImpl(UserGoalJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserGoal> findById(Long id) {
        return jpaRepository.findById(id)
            .map(UserGoalEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserGoal> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
            .map(UserGoalEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserGoal> findByUserIdOrderedByCreatedAtDesc(Long userId) {
        return jpaRepository.findByUserIdOrderedByCreatedAtDesc(userId).stream()
            .map(UserGoalEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserGoal> findByUserIdAndLifeDomainId(Long userId, Long lifeDomainId) {
        return jpaRepository.findByUserIdAndLifeDomainId(userId, lifeDomainId).stream()
            .map(UserGoalEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserGoal save(UserGoal userGoal) {
        UserGoalJpaEntity jpaEntity = UserGoalEntityMapper.toJpa(userGoal);
        UserGoalJpaEntity saved = jpaRepository.save(jpaEntity);
        return UserGoalEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(UserGoal userGoal) {
        jpaRepository.deleteById(userGoal.getId());
    }
}
