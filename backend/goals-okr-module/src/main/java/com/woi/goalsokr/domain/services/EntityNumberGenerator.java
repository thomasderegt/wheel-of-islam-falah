package com.woi.goalsokr.domain.services;

import com.woi.goalsokr.domain.enums.EntityType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

/**
 * Domain service for generating unique, human-readable entity numbers
 * Uses PostgreSQL sequences for thread-safe, auto-incrementing numbers
 * 
 * Format: PREFIX-NUMBER (e.g., "GOAL-123", "OBJ-SUB-456")
 */
@Service
public class EntityNumberGenerator {
    
    private final JdbcTemplate jdbcTemplate;
    
    public EntityNumberGenerator(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    /**
     * Generate next unique number for an entity type
     * 
     * @param entityType The type of entity to generate a number for
     * @return Unique number in format PREFIX-NUMBER (e.g., "GOAL-123")
     */
    public String generateNextNumber(EntityType entityType) {
        String sequenceName = "goals_okr." + entityType.getSequenceName();
        String prefix = entityType.getPrefix();
        
        // Get next value from sequence
        Long nextValue = jdbcTemplate.queryForObject(
            "SELECT nextval(?)",
            Long.class,
            sequenceName
        );
        
        return prefix + nextValue;
    }
}
