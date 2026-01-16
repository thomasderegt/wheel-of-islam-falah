package com.woi.content.application.queries;

/**
 * Query for getting all published books in a category
 * Only returns books with PUBLISHED status
 */
public record GetPublicBooksByCategoryQuery(
    Long categoryId
) {
    public GetPublicBooksByCategoryQuery {
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
    }
}

