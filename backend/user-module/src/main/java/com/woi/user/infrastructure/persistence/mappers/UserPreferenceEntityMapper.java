package com.woi.user.infrastructure.persistence.mappers;

import com.woi.user.domain.entities.UserPreference;
import com.woi.user.infrastructure.persistence.entities.UserPreferenceJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between UserPreference domain entity and UserPreferenceJpaEntity
 */
@Component
public class UserPreferenceEntityMapper {
    
    public UserPreference toDomain(UserPreferenceJpaEntity jpa) {
        if (jpa == null) return null;
        
        // Use factory method for business fields
        UserPreference pref = UserPreference.createDefault(jpa.getUserId());
        
        // Use package-private setters for persistence fields
        pref.setId(jpa.getId());
        pref.setCreatedAt(jpa.getCreatedAt());
        pref.setUpdatedAt(jpa.getUpdatedAt());
        
        // Business fields via package-private setters (only for mapping)
        pref.setDefaultContext(jpa.getDefaultContext());
        pref.setDefaultGoalsOkrContext(jpa.getDefaultGoalsOkrContext());
        
        return pref;
    }
    
    public UserPreferenceJpaEntity toJpa(UserPreference domain) {
        if (domain == null) return null;
        
        UserPreferenceJpaEntity jpa = new UserPreferenceJpaEntity();
        jpa.setId(domain.getId());
        jpa.setUserId(domain.getUserId());
        jpa.setDefaultContext(domain.getDefaultContext());
        jpa.setDefaultGoalsOkrContext(domain.getDefaultGoalsOkrContext());
        jpa.setCreatedAt(domain.getCreatedAt());
        jpa.setUpdatedAt(domain.getUpdatedAt());
        return jpa;
    }
}
