package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.DeclineTeamInvitationCommand;
import com.woi.user.domain.entities.TeamInvitation;
import com.woi.user.domain.entities.User;
import com.woi.user.domain.repositories.TeamInvitationRepository;
import com.woi.user.domain.repositories.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for declining a team invitation
 */
@Component
public class DeclineTeamInvitationCommandHandler {
    private final TeamInvitationRepository teamInvitationRepository;
    private final UserRepository userRepository;

    public DeclineTeamInvitationCommandHandler(
            TeamInvitationRepository teamInvitationRepository,
            UserRepository userRepository) {
        this.teamInvitationRepository = teamInvitationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void handle(DeclineTeamInvitationCommand command) {
        TeamInvitation invitation = teamInvitationRepository.findByToken(command.token())
            .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        if (invitation.isAccepted()) {
            throw new IllegalStateException("Invitation already accepted");
        }
        if (invitation.isExpired()) {
            throw new IllegalStateException("Invitation has expired");
        }

        User user = userRepository.findById(command.userId())
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + command.userId()));
        if (!user.getEmail().equalsIgnoreCase(invitation.getEmail())) {
            throw new IllegalArgumentException("User email does not match invitation email");
        }

        teamInvitationRepository.delete(invitation);
    }
}
