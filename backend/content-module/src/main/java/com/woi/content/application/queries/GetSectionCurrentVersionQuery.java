package com.woi.content.application.queries;

/**
 * Query for getting the current (working) version of a section
 */
public record GetSectionCurrentVersionQuery(
    Long sectionId
) {
    public GetSectionCurrentVersionQuery {
        if (sectionId == null) {
            throw new IllegalArgumentException("Section ID cannot be null");
        }
    }
}

