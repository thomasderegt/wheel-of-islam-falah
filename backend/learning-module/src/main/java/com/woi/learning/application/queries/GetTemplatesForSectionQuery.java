package com.woi.learning.application.queries;

/**
 * Query for getting all templates for a specific section
 */
public record GetTemplatesForSectionQuery(
    Long sectionId
) {
    public GetTemplatesForSectionQuery {
        if (sectionId == null) {
            throw new IllegalArgumentException("SectionId cannot be null");
        }
    }
}

