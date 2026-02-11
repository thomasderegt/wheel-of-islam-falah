package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.AcceptTeamInvitationCommand;
import com.woi.user.application.results.TeamMemberResult;
import com.woi.user.domain.entities.TeamInvitation;
import com.woi.user.domain.entities.TeamMember;
import com.woi.user.domain.repositories.TeamInvitationRepository;
import com.woi.user.domain.repositories.TeamMemberRepository;
import com.woi.user.domain.repositories.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for accepting a team invitation
 */
@Component
public class AcceptTeamInvitationCommandHandler {
    private final TeamInvitationRepository teamInvitationRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    
    public AcceptTeamInvitationCommandHandler(
            TeamInvitationRepository teamInvitationRepository,
            TeamMemberRepository teamMemberRepository,
            UserRepository userRepository) {
        this.teamInvitationRepository = teamInvitationRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public TeamMemberResult handle(AcceptTeamInvitationCommand command) {
        // 1. Find invitation by token
        TeamInvitation invitation = teamInvitationRepository.findByToken(command.token())
            .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));
        
        // 2. Validate invitation
        if (invitation.isAccepted()) {
            throw new IllegalStateException("Invitation already accepted");
        }
        if (invitation.isExpired()) {
            throw new IllegalStateException("Invitation has expired");
        }
        
        // 3. Validate user exists and email matches
        var user = userRepository.findById(command.userId())
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + command.userId()));
        
        if (!user.getEmail().equalsIgnoreCase(invitation.getEmail())) {
            throw new IllegalArgumentException("User email does not match invitation email");
        }
        
        // 4. Check if user is already a member
        if (teamMemberRepository.existsByTeamIdAndUserId(invitation.getTeamId(), command.userId())) {
            throw new IllegalStateException("User is already a member of this team");
        }
        
        // 5. Accept invitation
        invitation.accept();
        teamInvitationRepository.save(invitation);
        
        // 6. Create team member
        TeamMember member = TeamMember.create(
            invitation.getTeamId(),
            command.userId(),
            invitation.getRole(),
            invitation.getInvitedById()
        );
        TeamMember saved = teamMemberRepository.save(member);
        
        // 7. Return result
        return TeamMemberResult.from(saved);
    }
}
