package com.woi.content.application.queries;

/**
 * Query for getting a paragraph by ID
 */
public record GetParagraphQuery(
    Long paragraphId
) {
    public GetParagraphQuery {
        if (paragraphId == null) {
            throw new IllegalArgumentException("Paragraph ID cannot be null");
        }
    }
}

