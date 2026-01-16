package com.woi.content.application.queries;

/**
 * Query for getting the current (working) version of a chapter
 */
public record GetChapterCurrentVersionQuery(
    Long chapterId
) {
    public GetChapterCurrentVersionQuery {
        if (chapterId == null) {
            throw new IllegalArgumentException("Chapter ID cannot be null");
        }
    }
}

