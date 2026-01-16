package com.woi.content.application.queries;

/**
 * Query for getting a category by ID
 */
public record GetCategoryQuery(
    Long categoryId
) {
    public GetCategoryQuery {
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
    }
}

