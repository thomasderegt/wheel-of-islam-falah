package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.entities.User;
import com.woi.user.domain.repositories.UserRepository;
import com.woi.user.infrastructure.persistence.entities.UserJpaEntity;
import com.woi.user.infrastructure.persistence.mappers.UserEntityMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository implementation for User
 * Implements domain UserRepository interface using Spring Data JPA
 */
@Repository
public class UserRepositoryImpl implements UserRepository {
    private final UserJpaRepository jpaRepository;
    private final UserEntityMapper mapper;
    
    public UserRepositoryImpl(UserJpaRepository jpaRepository, UserEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    public Optional<User> findById(Long id) {
        return jpaRepository.findById(id)
            .map(mapper::toDomain);
    }
    
    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email)
            .map(mapper::toDomain);
    }
    
    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }
    
    @Override
    public User save(User user) {
        UserJpaEntity jpaEntity = mapper.toJpa(user);
        UserJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomain(saved);
    }
    
    @Override
    public void delete(User user) {
        jpaRepository.deleteById(user.getId());
    }
}

