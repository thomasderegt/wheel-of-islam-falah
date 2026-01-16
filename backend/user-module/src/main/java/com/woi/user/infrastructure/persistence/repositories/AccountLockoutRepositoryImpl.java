package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.entities.AccountLockout;
import com.woi.user.domain.repositories.AccountLockoutRepository;
import com.woi.user.infrastructure.persistence.entities.AccountLockoutJpaEntity;
import com.woi.user.infrastructure.persistence.mappers.AccountLockoutEntityMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository implementation for AccountLockout
 */
@Repository
public class AccountLockoutRepositoryImpl implements AccountLockoutRepository {
    private final AccountLockoutJpaRepository jpaRepository;
    private final AccountLockoutEntityMapper mapper;
    
    public AccountLockoutRepositoryImpl(AccountLockoutJpaRepository jpaRepository, AccountLockoutEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    public Optional<AccountLockout> findById(Long id) {
        return jpaRepository.findById(id)
            .map(mapper::toDomain);
    }
    
    @Override
    public Optional<AccountLockout> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId)
            .map(mapper::toDomain);
    }
    
    @Override
    public boolean existsByUserId(Long userId) {
        return jpaRepository.existsByUserId(userId);
    }
    
    @Override
    public AccountLockout save(AccountLockout accountLockout) {
        AccountLockoutJpaEntity jpaEntity = mapper.toJpa(accountLockout);
        AccountLockoutJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomain(saved);
    }
    
    @Override
    public void delete(AccountLockout accountLockout) {
        jpaRepository.deleteById(accountLockout.getId());
    }
}

