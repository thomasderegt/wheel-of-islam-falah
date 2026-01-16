package com.woi.content.api;

/**
 * Paragraph summary - Public API value object
 * Used for module-to-module communication
 * 
 * Note: In v1, Paragraph only contains metadata (no title/content - those are in ParagraphVersion in v2)
 */
public record ParagraphSummary(
    Long id,
    Long sectionId,
    Integer paragraphNumber
) {
    public ParagraphSummary {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        if (sectionId == null) {
            throw new IllegalArgumentException("Section ID cannot be null");
        }
        if (paragraphNumber == null) {
            throw new IllegalArgumentException("Paragraph number cannot be null");
        }
    }
}

