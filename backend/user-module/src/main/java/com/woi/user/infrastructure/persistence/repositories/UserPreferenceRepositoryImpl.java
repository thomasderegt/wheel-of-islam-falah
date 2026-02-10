package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.entities.UserPreference;
import com.woi.user.domain.repositories.UserPreferenceRepository;
import com.woi.user.infrastructure.persistence.entities.UserPreferenceJpaEntity;
import com.woi.user.infrastructure.persistence.mappers.UserPreferenceEntityMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository implementation for UserPreference
 * Implements domain UserPreferenceRepository interface using Spring Data JPA
 */
@Repository
public class UserPreferenceRepositoryImpl implements UserPreferenceRepository {
    private final UserPreferenceJpaRepository jpaRepository;
    private final UserPreferenceEntityMapper mapper;
    
    public UserPreferenceRepositoryImpl(UserPreferenceJpaRepository jpaRepository, UserPreferenceEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    public Optional<UserPreference> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId)
            .map(mapper::toDomain);
    }
    
    @Override
    public UserPreference save(UserPreference userPreference) {
        UserPreferenceJpaEntity jpaEntity = mapper.toJpa(userPreference);
        UserPreferenceJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomain(saved);
    }
    
    @Override
    public void delete(UserPreference userPreference) {
        jpaRepository.deleteById(userPreference.getId());
    }
}
