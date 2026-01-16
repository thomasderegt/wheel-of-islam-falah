package com.woi.content.application.queries;

/**
 * Query for getting the current (working) version of a book
 */
public record GetBookCurrentVersionQuery(
    Long bookId
) {
    public GetBookCurrentVersionQuery {
        if (bookId == null) {
            throw new IllegalArgumentException("Book ID cannot be null");
        }
    }
}

