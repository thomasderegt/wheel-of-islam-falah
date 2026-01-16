package com.woi.content.api;

import java.util.List;

/**
 * Section summary - Public API value object
 * Used for module-to-module communication
 * 
 * In v1: Section contains metadata + title/intro from SectionVersion (published or current)
 */
public record SectionSummary(
    Long id,
    Long chapterId,
    Integer orderIndex,
    String titleEn,  // Title from published version (or current if no published)
    String titleNl,  // Title from published version (or current if no published)
    String introEn,  // Intro from published version (or current if no published)
    String introNl,  // Intro from published version (or current if no published)
    List<ParagraphSummary> paragraphs  // Optional: paragraphs with title data
) {
    public SectionSummary {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        if (chapterId == null) {
            throw new IllegalArgumentException("Chapter ID cannot be null");
        }
        if (orderIndex == null) {
            throw new IllegalArgumentException("Order index cannot be null");
        }
    }
}

