package com.woi.content.api;

import java.util.List;

/**
 * Chapter summary - Public API value object
 * Used for module-to-module communication
 * 
 * Note: In v1, Chapter only contains metadata (no title/intro - those are in ChapterVersion in v2)
 */
public record ChapterSummary(
    Long id,
    Long bookId,
    Integer chapterNumber,
    Integer position,
    List<SectionSummary> sections
) {
    public ChapterSummary {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
    }
}

