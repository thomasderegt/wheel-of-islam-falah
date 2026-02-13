package com.woi.user.infrastructure.web.controllers;

import com.woi.user.application.handlers.queries.GetInvitationsForUserQueryHandler;
import com.woi.user.application.queries.GetInvitationsForUserQuery;
import com.woi.user.application.results.MyTeamInvitationResult;
import com.woi.user.infrastructure.web.dtos.MyTeamInvitationResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for team invitations received by the current user.
 * Separate from TeamController to avoid route conflicts with /teams/{teamId}.
 */
@RestController
@RequestMapping("/api/v2/users/team-invitations")
@CrossOrigin(origins = "*")
public class UserTeamInvitationsController {

    private final GetInvitationsForUserQueryHandler getInvitationsForUserHandler;

    public UserTeamInvitationsController(GetInvitationsForUserQueryHandler getInvitationsForUserHandler) {
        this.getInvitationsForUserHandler = getInvitationsForUserHandler;
    }

    /**
     * Get invitations for the authenticated user
     * GET /api/v2/users/team-invitations
     */
    @GetMapping
    public ResponseEntity<List<MyTeamInvitationResponseDTO>> getMyInvitations(
            @AuthenticationPrincipal Long userId) {
        List<MyTeamInvitationResult> results = getInvitationsForUserHandler.handle(
            new GetInvitationsForUserQuery(userId)
        );
        List<MyTeamInvitationResponseDTO> response = results.stream()
            .map(r -> new MyTeamInvitationResponseDTO(
                r.id(),
                r.teamId(),
                r.teamName(),
                r.role(),
                r.invitedById(),
                r.inviterName(),
                r.token(),
                r.expiresAt(),
                r.createdAt()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
