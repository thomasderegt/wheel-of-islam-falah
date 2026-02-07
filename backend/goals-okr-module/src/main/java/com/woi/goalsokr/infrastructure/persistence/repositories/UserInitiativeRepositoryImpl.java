package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.UserInitiative;
import com.woi.goalsokr.domain.enums.GoalStatus;
import com.woi.goalsokr.domain.repositories.UserInitiativeRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.UserInitiativeJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.UserInitiativeEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for UserInitiative
 */
@Repository
public class UserInitiativeRepositoryImpl implements UserInitiativeRepository {

    private final UserInitiativeJpaRepository jpaRepository;

    public UserInitiativeRepositoryImpl(UserInitiativeJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserInitiative> findById(Long id) {
        return jpaRepository.findById(id)
            .map(UserInitiativeEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserInitiative> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
            .map(UserInitiativeEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserInitiative> findByUserKeyResultInstanceId(Long userKeyResultInstanceId) {
        return jpaRepository.findByUserKeyResultInstanceId(userKeyResultInstanceId).stream()
            .map(UserInitiativeEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserInitiative> findByKeyResultId(Long keyResultId) {
        return jpaRepository.findByKeyResultId(keyResultId).stream()
            .map(UserInitiativeEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserInitiative> findByUserIdAndKeyResultId(Long userId, Long keyResultId) {
        return jpaRepository.findByUserIdAndKeyResultId(userId, keyResultId).stream()
            .map(UserInitiativeEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserInitiative> findByUserIdAndStatus(Long userId, GoalStatus status) {
        return jpaRepository.findByUserIdAndStatus(userId, status.name()).stream()
            .map(UserInitiativeEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserInitiative save(UserInitiative initiative) {
        UserInitiativeJpaEntity jpaEntity = UserInitiativeEntityMapper.toJpa(initiative);
        UserInitiativeJpaEntity saved = jpaRepository.save(jpaEntity);
        return UserInitiativeEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(UserInitiative initiative) {
        jpaRepository.deleteById(initiative.getId());
    }
}
