package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.domain.entities.Wheel;
import com.woi.content.domain.repositories.WheelRepository;
import com.woi.content.infrastructure.persistence.mappers.WheelEntityMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of WheelRepository using JPA
 */
@Component("contentWheelRepositoryImpl")
public class WheelRepositoryImpl implements WheelRepository {
    
    private final WheelJpaRepository jpaRepository;
    
    public WheelRepositoryImpl(WheelJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    public List<Wheel> findAllOrderedByDisplayOrder() {
        return jpaRepository.findAllByOrderByDisplayOrderAsc().stream()
            .map(WheelEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    public Optional<Wheel> findById(Long id) {
        return jpaRepository.findById(id)
            .map(WheelEntityMapper::toDomain);
    }
    
    @Override
    public Optional<Wheel> findByWheelKey(String wheelKey) {
        return jpaRepository.findByWheelKey(wheelKey)
            .map(WheelEntityMapper::toDomain);
    }
}
