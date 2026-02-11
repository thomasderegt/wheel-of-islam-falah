package com.woi.user.application.handlers.queries;

import com.woi.user.application.queries.GetTeamQuery;
import com.woi.user.application.results.TeamResult;
import com.woi.user.domain.repositories.TeamRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Query handler for getting a team by ID
 */
@Component
public class GetTeamQueryHandler {
    private final TeamRepository teamRepository;
    
    public GetTeamQueryHandler(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }
    
    @Transactional(readOnly = true)
    public Optional<TeamResult> handle(GetTeamQuery query) {
        return teamRepository.findById(query.teamId())
            .map(TeamResult::from);
    }
}
