package com.woi.user.infrastructure.persistence.mappers;

import com.woi.user.domain.entities.RefreshToken;
import com.woi.user.infrastructure.persistence.entities.RefreshTokenJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between RefreshToken domain entity and RefreshTokenJpaEntity
 */
@Component
public class RefreshTokenEntityMapper {
    
    public RefreshToken toDomain(RefreshTokenJpaEntity jpa) {
        if (jpa == null) return null;
        
        RefreshToken token = RefreshToken.create(jpa.getUserId(), jpa.getTokenHash(), jpa.getExpiresAt());
        token.setId(jpa.getId());
        token.setCreatedAt(jpa.getCreatedAt());
        token.setRevokedAt(jpa.getRevokedAt());
        return token;
    }
    
    public RefreshTokenJpaEntity toJpa(RefreshToken domain) {
        if (domain == null) return null;
        
        RefreshTokenJpaEntity jpa = new RefreshTokenJpaEntity();
        jpa.setId(domain.getId());
        jpa.setUserId(domain.getUserId());
        jpa.setTokenHash(domain.getTokenHash());
        jpa.setExpiresAt(domain.getExpiresAt());
        jpa.setCreatedAt(domain.getCreatedAt());
        jpa.setRevokedAt(domain.getRevokedAt());
        return jpa;
    }
}

