package com.woi.content.application.queries;

/**
 * Query for getting all chapters in a book
 */
public record GetChaptersByBookQuery(
    Long bookId
) {
    public GetChaptersByBookQuery {
        if (bookId == null) {
            throw new IllegalArgumentException("Book ID cannot be null");
        }
    }
}

