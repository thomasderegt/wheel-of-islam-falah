package com.woi.user.infrastructure.web.controllers;

import com.woi.user.application.handlers.queries.GetRolesQueryHandler;
import com.woi.user.application.handlers.queries.ListUsersQueryHandler;
import com.woi.user.application.queries.GetRolesQuery;
import com.woi.user.application.queries.ListUsersQuery;
import com.woi.user.application.results.AdminUserListItemResult;
import com.woi.user.domain.enums.UserRole;
import com.woi.user.infrastructure.web.dtos.AdminUserListItemDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller for admin-only user operations.
 * All endpoints require the authenticated user to have the ADMIN role.
 */
@RestController
@RequestMapping("/api/v2/admin")
@CrossOrigin(origins = "*")
public class AdminUserController {

    private final ListUsersQueryHandler listUsersQueryHandler;
    private final GetRolesQueryHandler getRolesQueryHandler;

    public AdminUserController(ListUsersQueryHandler listUsersQueryHandler,
                               GetRolesQueryHandler getRolesQueryHandler) {
        this.listUsersQueryHandler = listUsersQueryHandler;
        this.getRolesQueryHandler = getRolesQueryHandler;
    }

    /**
     * List all users (admin only).
     * GET /api/v2/admin/users
     */
    @GetMapping("/users")
    public ResponseEntity<?> listUsers(@AuthenticationPrincipal Long authUserId) {
        if (authUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<UserRole> callerRoles = getRolesQueryHandler.handle(new GetRolesQuery(authUserId));
        if (!callerRoles.contains(UserRole.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<AdminUserListItemResult> results = listUsersQueryHandler.handle(new ListUsersQuery());
        List<AdminUserListItemDTO> dtos = results.stream()
            .map(this::toDTO)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    private AdminUserListItemDTO toDTO(AdminUserListItemResult r) {
        AdminUserListItemDTO dto = new AdminUserListItemDTO();
        dto.setId(r.id());
        dto.setEmail(r.email());
        dto.setProfileName(r.profileName());
        dto.setStatus(r.status());
        dto.setCreatedAt(r.createdAt());
        dto.setUpdatedAt(r.updatedAt());
        dto.setRoles(r.roles());
        return dto;
    }
}
