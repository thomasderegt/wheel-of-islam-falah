package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.entities.Credential;
import com.woi.user.domain.repositories.CredentialRepository;
import com.woi.user.infrastructure.persistence.entities.CredentialJpaEntity;
import com.woi.user.infrastructure.persistence.mappers.CredentialEntityMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository implementation for Credential
 */
@Repository
public class CredentialRepositoryImpl implements CredentialRepository {
    private final CredentialJpaRepository jpaRepository;
    private final CredentialEntityMapper mapper;
    
    public CredentialRepositoryImpl(CredentialJpaRepository jpaRepository, CredentialEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    public Optional<Credential> findById(Long id) {
        return jpaRepository.findById(id)
            .map(mapper::toDomain);
    }
    
    @Override
    public Optional<Credential> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId)
            .map(mapper::toDomain);
    }
    
    @Override
    public boolean existsByUserId(Long userId) {
        return jpaRepository.existsByUserId(userId);
    }
    
    @Override
    public Credential save(Credential credential) {
        CredentialJpaEntity jpaEntity = mapper.toJpa(credential);
        CredentialJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomain(saved);
    }
    
    @Override
    public void delete(Credential credential) {
        jpaRepository.deleteById(credential.getId());
    }
}

