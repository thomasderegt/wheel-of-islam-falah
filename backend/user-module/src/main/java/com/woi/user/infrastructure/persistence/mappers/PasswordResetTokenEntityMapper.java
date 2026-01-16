package com.woi.user.infrastructure.persistence.mappers;

import com.woi.user.domain.entities.PasswordResetToken;
import com.woi.user.infrastructure.persistence.entities.PasswordResetTokenJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between PasswordResetToken domain entity and PasswordResetTokenJpaEntity
 */
@Component
public class PasswordResetTokenEntityMapper {
    
    public PasswordResetToken toDomain(PasswordResetTokenJpaEntity jpa) {
        if (jpa == null) return null;
        
        PasswordResetToken token = PasswordResetToken.create(jpa.getUserId(), jpa.getTokenHash(), jpa.getExpiresAt());
        token.setId(jpa.getId());
        token.setCreatedAt(jpa.getCreatedAt());
        token.setUsedAt(jpa.getUsedAt());
        return token;
    }
    
    public PasswordResetTokenJpaEntity toJpa(PasswordResetToken domain) {
        if (domain == null) return null;
        
        PasswordResetTokenJpaEntity jpa = new PasswordResetTokenJpaEntity();
        jpa.setId(domain.getId());
        jpa.setUserId(domain.getUserId());
        jpa.setTokenHash(domain.getTokenHash());
        jpa.setExpiresAt(domain.getExpiresAt());
        jpa.setUsedAt(domain.getUsedAt());
        jpa.setCreatedAt(domain.getCreatedAt());
        return jpa;
    }
}

