package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.LifeDomain;
import com.woi.goalsokr.domain.repositories.LifeDomainRepository;
import com.woi.goalsokr.infrastructure.persistence.mappers.LifeDomainEntityMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of LifeDomainRepository using JPA
 */
@Component
public class LifeDomainRepositoryImpl implements LifeDomainRepository {
    
    private final LifeDomainJpaRepository jpaRepository;
    
    public LifeDomainRepositoryImpl(LifeDomainJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    public List<LifeDomain> findAllOrderedByDisplayOrder() {
        return jpaRepository.findAllByOrderByDisplayOrderAsc().stream()
            .map(LifeDomainEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    public Optional<LifeDomain> findById(Long id) {
        return jpaRepository.findById(id)
            .map(LifeDomainEntityMapper::toDomain);
    }
}
