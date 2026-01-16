package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.entities.RefreshToken;
import com.woi.user.domain.repositories.RefreshTokenRepository;
import com.woi.user.infrastructure.persistence.entities.RefreshTokenJpaEntity;
import com.woi.user.infrastructure.persistence.mappers.RefreshTokenEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for RefreshToken
 */
@Repository
public class RefreshTokenRepositoryImpl implements RefreshTokenRepository {
    private final RefreshTokenJpaRepository jpaRepository;
    private final RefreshTokenEntityMapper mapper;
    
    public RefreshTokenRepositoryImpl(RefreshTokenJpaRepository jpaRepository, RefreshTokenEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    public Optional<RefreshToken> findById(Long id) {
        return jpaRepository.findById(id)
            .map(mapper::toDomain);
    }
    
    @Override
    public Optional<RefreshToken> findByTokenHash(String tokenHash) {
        return jpaRepository.findByTokenHash(tokenHash)
            .map(mapper::toDomain);
    }
    
    @Override
    public List<RefreshToken> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    public RefreshToken save(RefreshToken refreshToken) {
        RefreshTokenJpaEntity jpaEntity = mapper.toJpa(refreshToken);
        RefreshTokenJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomain(saved);
    }
    
    @Override
    public void delete(RefreshToken refreshToken) {
        jpaRepository.deleteById(refreshToken.getId());
    }
    
    @Override
    @Transactional
    public int revokeAllByUserId(Long userId) {
        return jpaRepository.revokeAllByUserId(userId, LocalDateTime.now());
    }
    
    @Override
    @Transactional
    public int deleteExpiredTokens(LocalDateTime now) {
        return jpaRepository.deleteExpiredTokens(now);
    }
}

