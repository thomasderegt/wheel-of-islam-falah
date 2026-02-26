package com.woi.content.application.results;

/**
 * Result for a flat content item (book, chapter, section, or paragraph) in the content hierarchy.
 * Used by GET /api/v2/content/items for admin content list.
 */
public record ContentItemResult(
    Long id,
    String type,
    String title,
    String path,
    Long bookId,
    Long categoryId
) {
    public static final String TYPE_BOOK = "BOOK";
    public static final String TYPE_CHAPTER = "CHAPTER";
    public static final String TYPE_SECTION = "SECTION";
    public static final String TYPE_PARAGRAPH = "PARAGRAPH";
}
