package com.woi.content.application.queries;

/**
 * Query for getting a category by category number
 */
public record GetCategoryByNumberQuery(
    Integer categoryNumber
) {
    public GetCategoryByNumberQuery {
        if (categoryNumber == null) {
            throw new IllegalArgumentException("Category number cannot be null");
        }
    }
}

