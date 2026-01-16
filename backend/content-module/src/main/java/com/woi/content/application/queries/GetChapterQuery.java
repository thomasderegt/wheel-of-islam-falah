package com.woi.content.application.queries;

/**
 * Query for getting a chapter by ID
 */
public record GetChapterQuery(
    Long chapterId
) {
    public GetChapterQuery {
        if (chapterId == null) {
            throw new IllegalArgumentException("Chapter ID cannot be null");
        }
    }
}

