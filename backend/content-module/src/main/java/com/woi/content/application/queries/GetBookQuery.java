package com.woi.content.application.queries;

/**
 * Query for getting a book by ID
 */
public record GetBookQuery(
    Long bookId
) {
    public GetBookQuery {
        if (bookId == null) {
            throw new IllegalArgumentException("Book ID cannot be null");
        }
    }
}

