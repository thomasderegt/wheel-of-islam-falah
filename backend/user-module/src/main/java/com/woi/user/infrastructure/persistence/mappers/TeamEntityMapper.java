package com.woi.user.infrastructure.persistence.mappers;

import com.woi.user.domain.entities.Team;
import com.woi.user.infrastructure.persistence.entities.TeamJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between Team domain entity and TeamJpaEntity
 */
@Component
public class TeamEntityMapper {
    
    public Team toDomain(TeamJpaEntity jpa) {
        if (jpa == null) return null;
        
        // Use factory method for business fields
        Team team = Team.create(jpa.getName(), jpa.getOwnerId());
        
        // Use setters for persistence fields
        team.setId(jpa.getId());
        team.setCreatedAt(jpa.getCreatedAt());
        team.setUpdatedAt(jpa.getUpdatedAt());
        
        // Business fields via business methods
        if (jpa.getDescription() != null) {
            team.updateDescription(jpa.getDescription());
        }
        
        // Status via setter (only for mapping)
        team.setStatus(jpa.getStatus());
        
        return team;
    }
    
    public TeamJpaEntity toJpa(Team domain) {
        if (domain == null) return null;
        
        TeamJpaEntity jpa = new TeamJpaEntity();
        jpa.setId(domain.getId());
        jpa.setName(domain.getName());
        jpa.setDescription(domain.getDescription());
        jpa.setOwnerId(domain.getOwnerId());
        jpa.setStatus(domain.getStatus());
        jpa.setCreatedAt(domain.getCreatedAt());
        jpa.setUpdatedAt(domain.getUpdatedAt());
        
        return jpa;
    }
}
