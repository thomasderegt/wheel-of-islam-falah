package com.woi.content.api;

import java.util.List;

/**
 * Category summary - Public API value object
 * Used for module-to-module communication
 */
public record CategorySummary(
    Long id,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    List<BookSummary> books
) {
    public CategorySummary {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
    }
}

