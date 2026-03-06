package com.woi.user.application.handlers.queries;

import com.woi.user.application.queries.GetRolesQuery;
import com.woi.user.application.queries.ListUsersQuery;
import com.woi.user.application.results.AdminUserListItemResult;
import com.woi.user.domain.entities.User;
import com.woi.user.domain.enums.UserRole;
import com.woi.user.domain.repositories.UserRepository;

import java.util.List;
import org.springframework.stereotype.Component;

/**
 * Query handler for listing all users (admin only).
 * Returns user data with roles for each user.
 */
@Component
public class ListUsersQueryHandler {

    private final UserRepository userRepository;
    private final GetRolesQueryHandler getRolesQueryHandler;

    public ListUsersQueryHandler(UserRepository userRepository,
                                 GetRolesQueryHandler getRolesQueryHandler) {
        this.userRepository = userRepository;
        this.getRolesQueryHandler = getRolesQueryHandler;
    }

    public List<AdminUserListItemResult> handle(ListUsersQuery query) {
        List<User> users = userRepository.findAll();
        return users.stream()
            .map(this::toListItem)
            .toList();
    }

    private AdminUserListItemResult toListItem(User user) {
        List<UserRole> roles = getRolesQueryHandler.handle(new GetRolesQuery(user.getId()));
        return new AdminUserListItemResult(
            user.getId(),
            user.getEmail(),
            user.getProfileName(),
            user.getStatus(),
            user.getCreatedAt(),
            user.getUpdatedAt(),
            roles
        );
    }
}
