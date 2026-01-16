package com.woi.learning.domain.enums;

/**
 * Progress status enum for learning flow step progress
 * 
 * NOT_STARTED: Step has not been started yet
 * IN_PROGRESS: User has started working on the step (has at least one answer)
 * COMPLETED: User has marked the step as completed
 */
public enum ProgressStatus {
    NOT_STARTED,
    IN_PROGRESS,
    COMPLETED
}

