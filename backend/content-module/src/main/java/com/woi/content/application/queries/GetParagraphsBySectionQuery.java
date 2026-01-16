package com.woi.content.application.queries;

/**
 * Query for getting all paragraphs in a section
 */
public record GetParagraphsBySectionQuery(
    Long sectionId
) {
    public GetParagraphsBySectionQuery {
        if (sectionId == null) {
            throw new IllegalArgumentException("Section ID cannot be null");
        }
    }
}

