package com.woi.user.infrastructure.persistence.mappers;

import com.woi.user.domain.entities.User;
import com.woi.user.infrastructure.persistence.entities.UserJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between User domain entity and UserJpaEntity
 */
@Component
public class UserEntityMapper {
    
    public User toDomain(UserJpaEntity jpa) {
        if (jpa == null) return null;
        
        // Gebruik factory method voor business velden
        User user = User.create(jpa.getEmail());
        
        // Gebruik package-private setters voor persistence-velden
        user.setId(jpa.getId());
        user.setCreatedAt(jpa.getCreatedAt());
        user.setUpdatedAt(jpa.getUpdatedAt());
        
        // Business velden via business methods
        if (jpa.getProfileName() != null) {
            user.updateProfileName(jpa.getProfileName());
        }
        
        // Status via package-private setter (alleen voor mapping)
        user.setStatus(jpa.getStatus());
        
        return user;
    }
    
    public UserJpaEntity toJpa(User domain) {
        if (domain == null) return null;
        
        UserJpaEntity jpa = new UserJpaEntity();
        jpa.setId(domain.getId());
        jpa.setEmail(domain.getEmail());
        jpa.setProfileName(domain.getProfileName());
        jpa.setStatus(domain.getStatus());
        jpa.setCreatedAt(domain.getCreatedAt());
        jpa.setUpdatedAt(domain.getUpdatedAt());
        return jpa;
    }
}

