package com.woi.user.infrastructure.persistence.mappers;

import com.woi.user.domain.entities.TeamKanbanShare;
import com.woi.user.infrastructure.persistence.entities.TeamKanbanShareJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between TeamKanbanShare domain entity and TeamKanbanShareJpaEntity
 */
@Component
public class TeamKanbanShareEntityMapper {
    public TeamKanbanShare toDomain(TeamKanbanShareJpaEntity jpa) {
        if (jpa == null) return null;
        
        TeamKanbanShare share = TeamKanbanShare.create(jpa.getTeamId(), jpa.getOwnerUserId());
        share.setId(jpa.getId());
        share.setSharedAt(jpa.getSharedAt());
        share.setUnsharedAt(jpa.getUnsharedAt());
        share.setCreatedAt(jpa.getCreatedAt());
        share.setUpdatedAt(jpa.getUpdatedAt());
        return share;
    }
    
    public TeamKanbanShareJpaEntity toJpa(TeamKanbanShare domain) {
        if (domain == null) return null;
        
        TeamKanbanShareJpaEntity jpa = new TeamKanbanShareJpaEntity();
        jpa.setId(domain.getId());
        jpa.setTeamId(domain.getTeamId());
        jpa.setOwnerUserId(domain.getOwnerUserId());
        jpa.setSharedAt(domain.getSharedAt());
        jpa.setUnsharedAt(domain.getUnsharedAt());
        jpa.setCreatedAt(domain.getCreatedAt());
        jpa.setUpdatedAt(domain.getUpdatedAt());
        return jpa;
    }
}
