package com.woi.user.infrastructure.web.controllers;

import com.woi.user.application.commands.AcceptTeamInvitationCommand;
import com.woi.user.application.commands.CreateTeamCommand;
import com.woi.user.application.commands.InviteTeamMemberCommand;
import com.woi.user.application.handlers.commands.AcceptTeamInvitationCommandHandler;
import com.woi.user.application.handlers.commands.CreateTeamCommandHandler;
import com.woi.user.application.handlers.commands.InviteTeamMemberCommandHandler;
import com.woi.user.application.handlers.queries.GetTeamMembersQueryHandler;
import com.woi.user.application.handlers.queries.GetTeamQueryHandler;
import com.woi.user.application.handlers.queries.GetTeamsByUserQueryHandler;
import com.woi.user.application.queries.GetTeamMembersQuery;
import com.woi.user.application.queries.GetTeamQuery;
import com.woi.user.application.queries.GetTeamsByUserQuery;
import com.woi.user.application.results.TeamInvitationResult;
import com.woi.user.application.results.TeamMemberResult;
import com.woi.user.application.results.TeamResult;
import com.woi.user.api.UserModuleInterface;
import com.woi.user.domain.enums.TeamRole;
import com.woi.user.infrastructure.web.dtos.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller for Team Management
 */
@RestController
@RequestMapping("/api/v2/users/teams")
@CrossOrigin(origins = "*")
public class TeamController {
    
    private final CreateTeamCommandHandler createTeamHandler;
    private final GetTeamQueryHandler getTeamHandler;
    private final GetTeamsByUserQueryHandler getTeamsByUserHandler;
    private final GetTeamMembersQueryHandler getTeamMembersHandler;
    private final InviteTeamMemberCommandHandler inviteMemberHandler;
    private final AcceptTeamInvitationCommandHandler acceptInvitationHandler;
    private final UserModuleInterface userModule;
    
    public TeamController(
            CreateTeamCommandHandler createTeamHandler,
            GetTeamQueryHandler getTeamHandler,
            GetTeamsByUserQueryHandler getTeamsByUserHandler,
            GetTeamMembersQueryHandler getTeamMembersHandler,
            InviteTeamMemberCommandHandler inviteMemberHandler,
            AcceptTeamInvitationCommandHandler acceptInvitationHandler,
            UserModuleInterface userModule) {
        this.createTeamHandler = createTeamHandler;
        this.getTeamHandler = getTeamHandler;
        this.getTeamsByUserHandler = getTeamsByUserHandler;
        this.getTeamMembersHandler = getTeamMembersHandler;
        this.inviteMemberHandler = inviteMemberHandler;
        this.acceptInvitationHandler = acceptInvitationHandler;
        this.userModule = userModule;
    }
    
    /**
     * Create a new team
     * POST /api/v2/users/teams
     */
    @PostMapping
    @Transactional
    public ResponseEntity<TeamResponseDTO> createTeam(
            @RequestBody CreateTeamRequestDTO request,
            @AuthenticationPrincipal Long userId) {
        try {
            TeamResult result = createTeamHandler.handle(
                new CreateTeamCommand(request.name(), request.description(), userId)
            );
            
            TeamResponseDTO response = new TeamResponseDTO(
                result.id(),
                result.name(),
                result.description(),
                result.ownerId(),
                result.status(),
                result.createdAt(),
                result.updatedAt()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * Get a team by ID
     * GET /api/v2/users/teams/{teamId}
     */
    @GetMapping("/{teamId}")
    public ResponseEntity<TeamResponseDTO> getTeam(
            @PathVariable Long teamId,
            @AuthenticationPrincipal Long userId) {
        // Authorization: User must be a member of the team
        if (!userModule.isUserTeamMember(userId, teamId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return getTeamHandler.handle(new GetTeamQuery(teamId))
            .map(result -> new TeamResponseDTO(
                result.id(),
                result.name(),
                result.description(),
                result.ownerId(),
                result.status(),
                result.createdAt(),
                result.updatedAt()
            ))
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get all teams for a user
     * GET /api/v2/users/users/{userId}/teams
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TeamResponseDTO>> getTeamsByUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal Long authenticatedUserId) {
        // Authorization: Only the authenticated user can request their own teams
        if (!userId.equals(authenticatedUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        List<TeamResult> results = getTeamsByUserHandler.handle(new GetTeamsByUserQuery(userId));
        
        List<TeamResponseDTO> response = results.stream()
            .map(result -> new TeamResponseDTO(
                result.id(),
                result.name(),
                result.description(),
                result.ownerId(),
                result.status(),
                result.createdAt(),
                result.updatedAt()
            ))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get all members of a team
     * GET /api/v2/users/teams/{teamId}/members
     */
    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<TeamMemberResponseDTO>> getTeamMembers(
            @PathVariable Long teamId,
            @AuthenticationPrincipal Long userId) {
        // Authorization: User must be a member of the team
        if (!userModule.isUserTeamMember(userId, teamId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        List<TeamMemberResult> results = getTeamMembersHandler.handle(new GetTeamMembersQuery(teamId));
        
        List<TeamMemberResponseDTO> response = results.stream()
            .map(result -> new TeamMemberResponseDTO(
                result.id(),
                result.teamId(),
                result.userId(),
                result.role(),
                result.status(),
                result.invitedById(),
                result.joinedAt(),
                result.createdAt()
            ))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Invite a team member
     * POST /api/v2/users/teams/{teamId}/members/invite
     */
    @PostMapping("/{teamId}/members/invite")
    @Transactional
    public ResponseEntity<TeamInvitationResponseDTO> inviteMember(
            @PathVariable Long teamId,
            @RequestBody InviteTeamMemberRequestDTO request,
            @AuthenticationPrincipal Long userId) {
        // Authorization: Only owner or admin can invite
        String role = userModule.getUserTeamRole(userId, teamId)
            .orElse(null);
        if (role == null || (!role.equals(TeamRole.OWNER.name()) && !role.equals(TeamRole.ADMIN.name()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            TeamInvitationResult result = inviteMemberHandler.handle(
                new InviteTeamMemberCommand(
                    teamId,
                    request.email(),
                    request.role() != null ? request.role() : "MEMBER",
                    userId
                )
            );
            
            TeamInvitationResponseDTO response = new TeamInvitationResponseDTO(
                result.id(),
                result.teamId(),
                result.email(),
                result.role(),
                result.invitedById(),
                result.token(),
                result.expiresAt(),
                result.acceptedAt(),
                result.createdAt()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * Accept a team invitation
     * POST /api/v2/users/teams/invitations/{token}/accept
     */
    @PostMapping("/invitations/{token}/accept")
    @Transactional
    public ResponseEntity<TeamMemberResponseDTO> acceptInvitation(
            @PathVariable String token,
            @AuthenticationPrincipal Long userId) {
        try {
            TeamMemberResult result = acceptInvitationHandler.handle(
                new AcceptTeamInvitationCommand(token, userId)
            );
            
            TeamMemberResponseDTO response = new TeamMemberResponseDTO(
                result.id(),
                result.teamId(),
                result.userId(),
                result.role(),
                result.status(),
                result.invitedById(),
                result.joinedAt(),
                result.createdAt()
            );
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
