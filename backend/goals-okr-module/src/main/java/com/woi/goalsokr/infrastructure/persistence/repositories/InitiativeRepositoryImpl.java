package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.Initiative;
import com.woi.goalsokr.domain.repositories.InitiativeRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.InitiativeJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.InitiativeEntityMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of InitiativeRepository using Spring Data JPA (template)
 */
@Component
public class InitiativeRepositoryImpl implements InitiativeRepository {
    private final InitiativeJpaRepository jpaRepository;

    public InitiativeRepositoryImpl(InitiativeJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<Initiative> findById(Long id) {
        return jpaRepository.findById(id)
                .map(InitiativeEntityMapper::toDomain);
    }

    @Override
    public List<Initiative> findByKeyResultId(Long keyResultId) {
        return jpaRepository.findByKeyResultIdOrderByDisplayOrderAsc(keyResultId)
                .stream()
                .map(InitiativeEntityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Initiative> findByCreatedByUserId(Long createdByUserId) {
        return jpaRepository.findByCreatedByUserIdOrderByCreatedAtDesc(createdByUserId)
                .stream()
                .map(InitiativeEntityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Initiative save(Initiative initiative) {
        InitiativeJpaEntity jpaEntity = InitiativeEntityMapper.toJpa(initiative);
        InitiativeJpaEntity saved = jpaRepository.save(jpaEntity);
        return InitiativeEntityMapper.toDomain(saved);
    }

    @Override
    public void delete(Long id) {
        jpaRepository.deleteById(id);
    }
}
