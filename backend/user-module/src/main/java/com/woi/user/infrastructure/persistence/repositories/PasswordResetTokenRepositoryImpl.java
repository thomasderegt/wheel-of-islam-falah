package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.entities.PasswordResetToken;
import com.woi.user.domain.repositories.PasswordResetTokenRepository;
import com.woi.user.infrastructure.persistence.entities.PasswordResetTokenJpaEntity;
import com.woi.user.infrastructure.persistence.mappers.PasswordResetTokenEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for PasswordResetToken
 */
@Repository
public class PasswordResetTokenRepositoryImpl implements PasswordResetTokenRepository {
    private final PasswordResetTokenJpaRepository jpaRepository;
    private final PasswordResetTokenEntityMapper mapper;
    
    public PasswordResetTokenRepositoryImpl(PasswordResetTokenJpaRepository jpaRepository, PasswordResetTokenEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    public Optional<PasswordResetToken> findById(Long id) {
        return jpaRepository.findById(id)
            .map(mapper::toDomain);
    }
    
    @Override
    public Optional<PasswordResetToken> findByTokenHash(String tokenHash) {
        return jpaRepository.findByTokenHash(tokenHash)
            .map(mapper::toDomain);
    }
    
    @Override
    public List<PasswordResetToken> findActiveTokensByUserId(Long userId, LocalDateTime now) {
        return jpaRepository.findActiveTokensByUserId(userId, now).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    public PasswordResetToken save(PasswordResetToken token) {
        PasswordResetTokenJpaEntity jpaEntity = mapper.toJpa(token);
        PasswordResetTokenJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomain(saved);
    }
    
    @Override
    public void delete(PasswordResetToken token) {
        jpaRepository.deleteById(token.getId());
    }
    
    @Override
    @Transactional
    public int revokeAllActiveTokensByUserId(Long userId) {
        return jpaRepository.revokeAllActiveTokensByUserId(userId, LocalDateTime.now());
    }
    
    @Override
    @Transactional
    public int deleteExpiredTokens(LocalDateTime now) {
        return jpaRepository.deleteExpiredTokens(now);
    }
}

