package com.woi.goalsokr.application.commands;

/**
 * Command to update an existing goal
 */
public record UpdateGoalCommand(
    Long goalId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    Integer quarter,
    Integer year
) {
    public UpdateGoalCommand {
        if (goalId == null) {
            throw new IllegalArgumentException("Goal ID cannot be null");
        }
        if (quarter != null && (quarter < 1 || quarter > 4)) {
            throw new IllegalArgumentException("Quarter must be between 1 and 4");
        }
        if (year != null && year < 2000) {
            throw new IllegalArgumentException("Year must be 2000 or later");
        }
    }
}
