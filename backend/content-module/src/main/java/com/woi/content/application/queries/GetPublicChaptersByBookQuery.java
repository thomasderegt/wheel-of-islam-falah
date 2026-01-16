package com.woi.content.application.queries;

/**
 * Query for getting all published chapters in a book
 * Only returns chapters with PUBLISHED status
 */
public record GetPublicChaptersByBookQuery(
    Long bookId
) {
    public GetPublicChaptersByBookQuery {
        if (bookId == null) {
            throw new IllegalArgumentException("Book ID cannot be null");
        }
    }
}


