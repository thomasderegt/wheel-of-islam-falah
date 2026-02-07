package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.UserObjective;
import com.woi.goalsokr.domain.repositories.UserObjectiveRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.UserObjectiveJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.UserObjectiveEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for UserObjective
 */
@Repository
public class UserObjectiveRepositoryImpl implements UserObjectiveRepository {

    private final UserObjectiveJpaRepository jpaRepository;

    public UserObjectiveRepositoryImpl(UserObjectiveJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserObjective> findById(Long id) {
        return jpaRepository.findById(id)
            .map(UserObjectiveEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserObjective> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
            .map(UserObjectiveEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserObjective> findByUserGoalId(Long userGoalId) {
        return jpaRepository.findByUserGoalId(userGoalId).stream()
            .map(UserObjectiveEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserObjective> findByUserGoalIdOrderedByCreatedAtDesc(Long userGoalId) {
        return jpaRepository.findByUserGoalIdOrderedByCreatedAtDesc(userGoalId).stream()
            .map(UserObjectiveEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserObjective save(UserObjective userObjective) {
        UserObjectiveJpaEntity jpaEntity = UserObjectiveEntityMapper.toJpa(userObjective);
        UserObjectiveJpaEntity saved = jpaRepository.save(jpaEntity);
        return UserObjectiveEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(UserObjective userObjective) {
        jpaRepository.deleteById(userObjective.getId());
    }
}
