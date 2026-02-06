package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.UserObjectiveInstance;
import com.woi.goalsokr.domain.repositories.UserObjectiveInstanceRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.UserObjectiveInstanceJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.UserObjectiveInstanceEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for UserObjectiveInstance
 */
@Repository
public class UserObjectiveInstanceRepositoryImpl implements UserObjectiveInstanceRepository {

    private final UserObjectiveInstanceJpaRepository jpaRepository;

    public UserObjectiveInstanceRepositoryImpl(UserObjectiveInstanceJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserObjectiveInstance> findById(Long id) {
        return jpaRepository.findById(id)
            .map(UserObjectiveInstanceEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserObjectiveInstance> findByUserGoalInstanceId(Long userGoalInstanceId) {
        return jpaRepository.findByUserGoalInstanceId(userGoalInstanceId).stream()
            .map(UserObjectiveInstanceEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserObjectiveInstance> findByUserGoalInstanceIdIn(List<Long> userGoalInstanceIds) {
        return jpaRepository.findByUserGoalInstanceIdIn(userGoalInstanceIds).stream()
            .map(UserObjectiveInstanceEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserObjectiveInstance> findByUserGoalInstanceIdAndObjectiveId(Long userGoalInstanceId, Long objectiveId) {
        return jpaRepository.findByUserGoalInstanceIdAndObjectiveId(userGoalInstanceId, objectiveId)
            .map(UserObjectiveInstanceEntityMapper::toDomain);
    }

    @Override
    @Transactional
    public UserObjectiveInstance save(UserObjectiveInstance userObjectiveInstance) {
        UserObjectiveInstanceJpaEntity jpaEntity = UserObjectiveInstanceEntityMapper.toJpa(userObjectiveInstance);
        UserObjectiveInstanceJpaEntity saved = jpaRepository.save(jpaEntity);
        return UserObjectiveInstanceEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(UserObjectiveInstance userObjectiveInstance) {
        jpaRepository.deleteById(userObjectiveInstance.getId());
    }
}
