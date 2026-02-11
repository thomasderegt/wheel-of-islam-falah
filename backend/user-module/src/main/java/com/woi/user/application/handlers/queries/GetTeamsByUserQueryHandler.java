package com.woi.user.application.handlers.queries;

import com.woi.user.application.queries.GetTeamsByUserQuery;
import com.woi.user.application.results.TeamResult;
import com.woi.user.domain.repositories.TeamRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting all teams for a user
 */
@Component
public class GetTeamsByUserQueryHandler {
    private final TeamRepository teamRepository;
    
    public GetTeamsByUserQueryHandler(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }
    
    @Transactional(readOnly = true)
    public List<TeamResult> handle(GetTeamsByUserQuery query) {
        return teamRepository.findByUserId(query.userId()).stream()
            .map(TeamResult::from)
            .collect(Collectors.toList());
    }
}
