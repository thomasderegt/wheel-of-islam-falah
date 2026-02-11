package com.woi.user.infrastructure.persistence.mappers;

import com.woi.user.domain.entities.TeamMember;
import com.woi.user.domain.enums.TeamMemberStatus;
import com.woi.user.domain.enums.TeamRole;
import com.woi.user.infrastructure.persistence.entities.TeamMemberJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between TeamMember domain entity and TeamMemberJpaEntity
 */
@Component
public class TeamMemberEntityMapper {
    
    public TeamMember toDomain(TeamMemberJpaEntity jpa) {
        if (jpa == null) return null;
        
        TeamMember member = TeamMember.create(
            jpa.getTeamId(),
            jpa.getUserId(),
            TeamRole.valueOf(jpa.getRole()),
            jpa.getInvitedById()
        );
        
        // Use setters for persistence fields
        member.setId(jpa.getId());
        member.setStatus(TeamMemberStatus.valueOf(jpa.getStatus()));
        member.setJoinedAt(jpa.getJoinedAt());
        member.setLeftAt(jpa.getLeftAt());
        member.setCreatedAt(jpa.getCreatedAt());
        member.setUpdatedAt(jpa.getUpdatedAt());
        
        return member;
    }
    
    public TeamMemberJpaEntity toJpa(TeamMember domain) {
        if (domain == null) return null;
        
        TeamMemberJpaEntity jpa = new TeamMemberJpaEntity();
        jpa.setId(domain.getId());
        jpa.setTeamId(domain.getTeamId());
        jpa.setUserId(domain.getUserId());
        jpa.setRole(domain.getRole().name());
        jpa.setStatus(domain.getStatus().name());
        jpa.setInvitedById(domain.getInvitedById());
        jpa.setJoinedAt(domain.getJoinedAt());
        jpa.setLeftAt(domain.getLeftAt());
        jpa.setCreatedAt(domain.getCreatedAt());
        jpa.setUpdatedAt(domain.getUpdatedAt());
        
        return jpa;
    }
}
