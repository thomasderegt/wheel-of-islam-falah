package com.woi.goalsokr.domain.enums;

/**
 * Entity types for numbering system
 * Each type has a prefix and a sequence name for generating unique numbers
 */
public enum EntityType {
    // Templates (admin-created)
    GOAL("GOAL-", "seq_goal_number"),
    OBJECTIVE("OBJ-", "seq_objective_number"),
    KEY_RESULT("KR-", "seq_key_result_number"),
    INITIATIVE("INIT-", "seq_initiative_number"),
    
    // User subscriptions (user instances of templates)
    USER_GOAL_INSTANCE("GOAL-SUB-", "seq_user_goal_instance_number"),
    USER_OBJECTIVE_INSTANCE("OBJ-SUB-", "seq_user_objective_instance_number"),
    USER_KEY_RESULT_INSTANCE("KR-SUB-", "seq_user_key_result_instance_number"),
    USER_INITIATIVE_INSTANCE("INIT-SUB-", "seq_user_initiative_instance_number"),
    
    // User-created (user's own goals)
    USER_GOAL("MY-GOAL-", "seq_user_goal_number"),
    USER_OBJECTIVE("MY-OBJ-", "seq_user_objective_number"),
    USER_KEY_RESULT("MY-KR-", "seq_user_key_result_number"),
    USER_INITIATIVE("MY-INIT-", "seq_user_initiative_number"),
    
    // Kanban
    KANBAN_ITEM("KANBAN-", "seq_kanban_item_number");
    
    private final String prefix;
    private final String sequenceName;
    
    EntityType(String prefix, String sequenceName) {
        this.prefix = prefix;
        this.sequenceName = sequenceName;
    }
    
    /**
     * Get the prefix for this entity type (e.g., "GOAL-", "OBJ-SUB-")
     */
    public String getPrefix() {
        return prefix;
    }
    
    /**
     * Get the sequence name for this entity type (e.g., "seq_goal_number")
     */
    public String getSequenceName() {
        return sequenceName;
    }
}
