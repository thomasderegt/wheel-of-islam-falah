package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.CreateTeamCommand;
import com.woi.user.application.results.TeamResult;
import com.woi.user.domain.entities.Team;
import com.woi.user.domain.entities.TeamMember;
import com.woi.user.domain.enums.TeamRole;
import com.woi.user.domain.repositories.TeamMemberRepository;
import com.woi.user.domain.repositories.TeamRepository;
import com.woi.user.domain.repositories.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for creating a new team
 * 
 * Responsibilities:
 * - Create team entity
 * - Add owner as team member with OWNER role
 * - Validate owner exists
 */
@Component
public class CreateTeamCommandHandler {
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    
    public CreateTeamCommandHandler(
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public TeamResult handle(CreateTeamCommand command) {
        // 1. Validate owner exists
        userRepository.findById(command.ownerId())
            .orElseThrow(() -> new IllegalArgumentException("Owner not found: " + command.ownerId()));
        
        // 2. Create team (domain factory method validates)
        Team team = Team.create(command.name(), command.ownerId());
        if (command.description() != null) {
            team.updateDescription(command.description());
        }
        
        // 3. Save team
        Team savedTeam = teamRepository.save(team);
        
        // 4. Add owner as team member with OWNER role
        TeamMember ownerMember = TeamMember.create(
            savedTeam.getId(),
            command.ownerId(),
            TeamRole.OWNER,
            command.ownerId() // Owner invited themselves
        );
        teamMemberRepository.save(ownerMember);
        
        // 5. Return result
        return TeamResult.from(savedTeam);
    }
}
