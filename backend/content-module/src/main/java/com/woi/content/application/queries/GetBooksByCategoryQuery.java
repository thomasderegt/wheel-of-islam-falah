package com.woi.content.application.queries;

/**
 * Query for getting all books in a category
 */
public record GetBooksByCategoryQuery(
    Long categoryId
) {
    public GetBooksByCategoryQuery {
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
    }
}

