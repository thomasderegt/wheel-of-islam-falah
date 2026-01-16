package com.woi.user.infrastructure.persistence.mappers;

import com.woi.user.domain.entities.Credential;
import com.woi.user.infrastructure.persistence.entities.CredentialJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between Credential domain entity and CredentialJpaEntity
 */
@Component
public class CredentialEntityMapper {
    
    public Credential toDomain(CredentialJpaEntity jpa) {
        if (jpa == null) return null;
        
        // Use createFromHash when loading from database (password is already hashed)
        Credential credential = Credential.createFromHash(jpa.getUserId(), jpa.getPasswordHash());
        credential.setId(jpa.getId());
        credential.setPasswordUpdatedAt(jpa.getPasswordUpdatedAt());
        return credential;
    }
    
    public CredentialJpaEntity toJpa(Credential domain) {
        if (domain == null) return null;
        
        CredentialJpaEntity jpa = new CredentialJpaEntity();
        jpa.setId(domain.getId());
        jpa.setUserId(domain.getUserId());
        jpa.setPasswordHash(domain.getPasswordHash());
        jpa.setPasswordUpdatedAt(domain.getPasswordUpdatedAt());
        return jpa;
    }
}

