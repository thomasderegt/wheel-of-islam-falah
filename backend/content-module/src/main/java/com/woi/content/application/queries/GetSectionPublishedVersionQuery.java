package com.woi.content.application.queries;

/**
 * Query for getting the published version of a section
 */
public record GetSectionPublishedVersionQuery(
    Long sectionId
) {
    public GetSectionPublishedVersionQuery {
        if (sectionId == null) {
            throw new IllegalArgumentException("Section ID cannot be null");
        }
    }
}

