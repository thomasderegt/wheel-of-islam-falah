package com.woi.content.application.queries;

/**
 * Query for getting all sections in a chapter
 */
public record GetSectionsByChapterQuery(
    Long chapterId
) {
    public GetSectionsByChapterQuery {
        if (chapterId == null) {
            throw new IllegalArgumentException("Chapter ID cannot be null");
        }
    }
}

