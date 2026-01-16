package com.woi.content.application.queries;

/**
 * Query for getting all published sections in a chapter
 * Only returns sections with PUBLISHED status
 */
public record GetPublicSectionsByChapterQuery(
    Long chapterId
) {
    public GetPublicSectionsByChapterQuery {
        if (chapterId == null) {
            throw new IllegalArgumentException("Chapter ID cannot be null");
        }
    }
}


