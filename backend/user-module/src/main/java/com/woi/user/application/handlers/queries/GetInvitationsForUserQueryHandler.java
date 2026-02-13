package com.woi.user.application.handlers.queries;

import com.woi.user.application.queries.GetInvitationsForUserQuery;
import com.woi.user.application.results.MyTeamInvitationResult;
import com.woi.user.domain.entities.Team;
import com.woi.user.domain.entities.TeamInvitation;
import com.woi.user.domain.entities.User;
import com.woi.user.domain.repositories.TeamInvitationRepository;
import com.woi.user.domain.repositories.TeamRepository;
import com.woi.user.domain.repositories.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Query handler for getting all pending invitations for the authenticated user
 */
@Component
public class GetInvitationsForUserQueryHandler {
    private final TeamInvitationRepository teamInvitationRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    public GetInvitationsForUserQueryHandler(
            TeamInvitationRepository teamInvitationRepository,
            UserRepository userRepository,
            TeamRepository teamRepository) {
        this.teamInvitationRepository = teamInvitationRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
    }

    @Transactional(readOnly = true)
    public List<MyTeamInvitationResult> handle(GetInvitationsForUserQuery query) {
        User user = userRepository.findById(query.userId())
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + query.userId()));

        List<TeamInvitation> invitations = teamInvitationRepository.findByEmail(user.getEmail()).stream()
            .filter(inv -> !inv.isAccepted() && !inv.isExpired())
            .toList();

        List<MyTeamInvitationResult> results = new ArrayList<>();
        for (TeamInvitation inv : invitations) {
            String teamName = teamRepository.findById(inv.getTeamId())
                .map(Team::getName)
                .orElse("Unknown Team");
            String inviterName = userRepository.findById(inv.getInvitedById())
                .map(User::getEmail)
                .orElse("Unknown User");

            results.add(new MyTeamInvitationResult(
                inv.getId(),
                inv.getTeamId(),
                teamName,
                inv.getRole().name(),
                inv.getInvitedById(),
                inviterName,
                inv.getToken(),
                inv.getExpiresAt(),
                inv.getCreatedAt()
            ));
        }
        return results;
    }
}
