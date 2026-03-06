package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.Wheel;
import com.woi.goalsokr.domain.repositories.WheelRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.WheelJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.WheelEntityMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of WheelRepository using JPA
 */
@Component("goalsOkrWheelRepositoryImpl")
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

    @Override
    public Wheel save(Wheel wheel) {
        WheelJpaEntity jpa = WheelEntityMapper.toJpa(wheel);
        WheelJpaEntity saved = jpaRepository.save(jpa);
        return WheelEntityMapper.toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsByWheelKeyExcludingId(String wheelKey, Long excludeId) {
        return jpaRepository.existsByWheelKeyAndIdNot(wheelKey, excludeId);
    }
}
