package com.woi.content.application.queries;

/**
 * Query for getting a section by ID
 */
public record GetSectionQuery(
    Long sectionId
) {
    public GetSectionQuery {
        if (sectionId == null) {
            throw new IllegalArgumentException("Section ID cannot be null");
        }
    }
}

