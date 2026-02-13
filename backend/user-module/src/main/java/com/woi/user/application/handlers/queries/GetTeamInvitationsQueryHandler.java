package com.woi.user.application.handlers.queries;

import com.woi.user.application.queries.GetTeamInvitationsQuery;
import com.woi.user.application.results.TeamInvitationResult;
import com.woi.user.domain.repositories.TeamInvitationRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting all pending invitations for a team
 */
@Component
public class GetTeamInvitationsQueryHandler {
    private final TeamInvitationRepository teamInvitationRepository;

    public GetTeamInvitationsQueryHandler(TeamInvitationRepository teamInvitationRepository) {
        this.teamInvitationRepository = teamInvitationRepository;
    }

    @Transactional(readOnly = true)
    public List<TeamInvitationResult> handle(GetTeamInvitationsQuery query) {
        return teamInvitationRepository.findByTeamId(query.teamId()).stream()
            .filter(inv -> !inv.isAccepted() && !inv.isExpired())
            .map(TeamInvitationResult::from)
            .collect(Collectors.toList());
    }
}
