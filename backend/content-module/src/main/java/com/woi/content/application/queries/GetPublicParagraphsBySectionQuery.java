package com.woi.content.application.queries;

/**
 * Query for getting all published paragraphs in a section
 * Only returns paragraphs with PUBLISHED status
 */
public record GetPublicParagraphsBySectionQuery(
    Long sectionId
) {
    public GetPublicParagraphsBySectionQuery {
        if (sectionId == null) {
            throw new IllegalArgumentException("Section ID cannot be null");
        }
    }
}


