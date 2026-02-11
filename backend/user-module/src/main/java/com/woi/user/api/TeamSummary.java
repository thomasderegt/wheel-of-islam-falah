package com.woi.user.api;

/**
 * Team summary for module-to-module communication
 */
public record TeamSummary(
    Long id,
    String name,
    Long ownerId
) {}
