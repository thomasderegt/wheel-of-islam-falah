package com.woi.content.application.queries;

/**
 * Query for getting a category with complete hierarchy
 * Returns category with all books, chapters, sections, and paragraphs
 */
public record GetCategoryWithHierarchyQuery(
    Long categoryId
) {
    public GetCategoryWithHierarchyQuery {
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
    }
}

