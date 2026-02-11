package com.woi.user.infrastructure.persistence.mappers;

import com.woi.user.domain.entities.TeamInvitation;
import com.woi.user.domain.enums.TeamRole;
import com.woi.user.infrastructure.persistence.entities.TeamInvitationJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between TeamInvitation domain entity and TeamInvitationJpaEntity
 */
@Component
public class TeamInvitationEntityMapper {
    
    public TeamInvitation toDomain(TeamInvitationJpaEntity jpa) {
        if (jpa == null) return null;
        
        TeamInvitation invitation = TeamInvitation.create(
            jpa.getTeamId(),
            jpa.getEmail(),
            TeamRole.valueOf(jpa.getRole()),
            jpa.getInvitedById(),
            jpa.getToken(),
            jpa.getExpiresAt()
        );
        
        // Use setters for persistence fields
        invitation.setId(jpa.getId());
        invitation.setAcceptedAt(jpa.getAcceptedAt());
        invitation.setCreatedAt(jpa.getCreatedAt());
        
        return invitation;
    }
    
    public TeamInvitationJpaEntity toJpa(TeamInvitation domain) {
        if (domain == null) return null;
        
        TeamInvitationJpaEntity jpa = new TeamInvitationJpaEntity();
        jpa.setId(domain.getId());
        jpa.setTeamId(domain.getTeamId());
        jpa.setEmail(domain.getEmail());
        jpa.setRole(domain.getRole().name());
        jpa.setInvitedById(domain.getInvitedById());
        jpa.setToken(domain.getToken());
        jpa.setExpiresAt(domain.getExpiresAt());
        jpa.setAcceptedAt(domain.getAcceptedAt());
        jpa.setCreatedAt(domain.getCreatedAt());
        
        return jpa;
    }
}
