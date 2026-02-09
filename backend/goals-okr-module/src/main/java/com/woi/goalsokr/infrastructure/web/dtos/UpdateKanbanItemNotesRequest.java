package com.woi.goalsokr.infrastructure.web.dtos;

/**
 * Request DTO for updating kanban item notes
 */
public record UpdateKanbanItemNotesRequest(
    String notes // Can be null or empty to clear notes
) {}
