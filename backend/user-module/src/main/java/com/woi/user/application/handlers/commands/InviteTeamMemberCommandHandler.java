package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.InviteTeamMemberCommand;
import com.woi.user.application.results.TeamInvitationResult;
import com.woi.user.domain.entities.TeamInvitation;
import com.woi.user.domain.enums.TeamRole;
import com.woi.user.domain.repositories.TeamInvitationRepository;
import com.woi.user.domain.repositories.TeamMemberRepository;
import com.woi.user.domain.repositories.TeamRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Command handler for inviting a team member
 */
@Component
public class InviteTeamMemberCommandHandler {
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamInvitationRepository teamInvitationRepository;
    
    public InviteTeamMemberCommandHandler(
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            TeamInvitationRepository teamInvitationRepository) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.teamInvitationRepository = teamInvitationRepository;
    }
    
    @Transactional
    public TeamInvitationResult handle(InviteTeamMemberCommand command) {
        // 1. Validate team exists
        teamRepository.findById(command.teamId())
            .orElseThrow(() -> new IllegalArgumentException("Team not found: " + command.teamId()));
        
        // 2. Check if invitation already exists for this email
        var existingInvitations = teamInvitationRepository.findByTeamIdAndEmail(
            command.teamId(), command.email());
        // Filter out accepted invitations
        boolean hasPendingInvitation = existingInvitations.stream()
            .anyMatch(inv -> inv.getAcceptedAt() == null && !inv.isExpired());
        if (hasPendingInvitation) {
            throw new IllegalArgumentException("User already invited to this team");
        }
        
        // 3. Parse role
        TeamRole role;
        try {
            role = TeamRole.valueOf(command.role().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + command.role());
        }
        
        // 4. Generate unique token
        String token = UUID.randomUUID().toString();
        
        // 5. Create invitation (expires in 7 days)
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(7);
        TeamInvitation invitation = TeamInvitation.create(
            command.teamId(),
            command.email(),
            role,
            command.invitedById(),
            token,
            expiresAt
        );
        
        // 6. Save invitation
        TeamInvitation saved = teamInvitationRepository.save(invitation);
        
        // 7. Return result
        return TeamInvitationResult.from(saved);
    }
}
