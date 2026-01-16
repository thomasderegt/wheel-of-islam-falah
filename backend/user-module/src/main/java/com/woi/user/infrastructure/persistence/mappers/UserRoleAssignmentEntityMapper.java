package com.woi.user.infrastructure.persistence.mappers;

import com.woi.user.domain.entities.UserRoleAssignment;
import com.woi.user.infrastructure.persistence.entities.UserRoleAssignmentJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between UserRoleAssignment domain entity and UserRoleAssignmentJpaEntity
 */
@Component
public class UserRoleAssignmentEntityMapper {
    
    public UserRoleAssignment toDomain(UserRoleAssignmentJpaEntity jpa) {
        if (jpa == null) return null;
        
        UserRoleAssignment assignment = UserRoleAssignment.create(jpa.getUserId(), jpa.getRole());
        assignment.setId(jpa.getId());
        assignment.setCreatedAt(jpa.getCreatedAt());
        return assignment;
    }
    
    public UserRoleAssignmentJpaEntity toJpa(UserRoleAssignment domain) {
        if (domain == null) return null;
        
        UserRoleAssignmentJpaEntity jpa = new UserRoleAssignmentJpaEntity();
        jpa.setId(domain.getId());
        jpa.setUserId(domain.getUserId());
        jpa.setRole(domain.getRole());
        jpa.setCreatedAt(domain.getCreatedAt());
        return jpa;
    }
}

