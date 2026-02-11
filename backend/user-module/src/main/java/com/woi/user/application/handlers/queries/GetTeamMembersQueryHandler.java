package com.woi.user.application.handlers.queries;

import com.woi.user.application.queries.GetTeamMembersQuery;
import com.woi.user.application.results.TeamMemberResult;
import com.woi.user.domain.repositories.TeamMemberRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting all members of a team
 */
@Component
public class GetTeamMembersQueryHandler {
    private final TeamMemberRepository teamMemberRepository;
    
    public GetTeamMembersQueryHandler(TeamMemberRepository teamMemberRepository) {
        this.teamMemberRepository = teamMemberRepository;
    }
    
    @Transactional(readOnly = true)
    public List<TeamMemberResult> handle(GetTeamMembersQuery query) {
        return teamMemberRepository.findByTeamId(query.teamId()).stream()
            .map(TeamMemberResult::from)
            .collect(Collectors.toList());
    }
}
