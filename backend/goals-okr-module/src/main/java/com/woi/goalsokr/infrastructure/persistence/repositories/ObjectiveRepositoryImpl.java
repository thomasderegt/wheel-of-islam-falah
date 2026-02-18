package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.Objective;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.ObjectiveJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.ObjectiveEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for Objective
 */
@Repository
public class ObjectiveRepositoryImpl implements ObjectiveRepository {

    private final ObjectiveJpaRepository jpaRepository;

    public ObjectiveRepositoryImpl(ObjectiveJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Objective> findById(Long id) {
        return jpaRepository.findById(id)
            .map(ObjectiveEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Objective> findByLifeDomainId(Long lifeDomainId) {
        return jpaRepository.findByLifeDomainId(lifeDomainId).stream()
            .map(ObjectiveEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Objective> findByLifeDomainIdOrderedByOrderIndex(Long lifeDomainId) {
        return jpaRepository.findByLifeDomainIdOrderedByOrderIndex(lifeDomainId).stream()
            .map(ObjectiveEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Objective save(Objective objective) {
        ObjectiveJpaEntity jpaEntity = ObjectiveEntityMapper.toJpa(objective);
        ObjectiveJpaEntity saved = jpaRepository.save(jpaEntity);
        return ObjectiveEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(Objective objective) {
        jpaRepository.deleteById(objective.getId());
    }
}
