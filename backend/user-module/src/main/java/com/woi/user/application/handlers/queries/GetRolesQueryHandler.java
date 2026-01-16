package com.woi.user.application.handlers.queries;

import com.woi.user.application.queries.GetRolesQuery;
import com.woi.user.domain.entities.UserRoleAssignment;
import com.woi.user.domain.enums.UserRole;
import com.woi.user.domain.repositories.UserRoleAssignmentRepository;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting roles for a user
 * 
 * Responsibilities:
 * - Retrieve user role assignments
 * - Map to list of roles
 */
@Component
public class GetRolesQueryHandler {
    private final UserRoleAssignmentRepository roleAssignmentRepository;
    
    public GetRolesQueryHandler(UserRoleAssignmentRepository roleAssignmentRepository) {
        this.roleAssignmentRepository = roleAssignmentRepository;
    }
    
    public List<UserRole> handle(GetRolesQuery query) {
        List<UserRoleAssignment> assignments = roleAssignmentRepository.findByUserId(query.userId());
        return assignments.stream()
            .map(UserRoleAssignment::getRole)
            .collect(Collectors.toList());
    }
}

