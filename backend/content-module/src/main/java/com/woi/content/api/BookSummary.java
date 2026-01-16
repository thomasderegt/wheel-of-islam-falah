package com.woi.content.api;

import java.util.List;

/**
 * Book summary - Public API value object
 * Used for module-to-module communication
 * 
 * Note: In v1, Book only contains metadata (no title/intro - those are in BookVersion in v2)
 */
public record BookSummary(
    Long id,
    Long categoryId,
    Integer bookNumber,
    List<ChapterSummary> chapters
) {
    public BookSummary {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
    }
}

