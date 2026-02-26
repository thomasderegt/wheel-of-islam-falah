package com.woi.content.application.queries;

/**
 * Query for fetching a flat list of content items (books, chapters, sections, paragraphs)
 * with optional filters. Used by GET /api/v2/content/items.
 */
public record GetContentItemsQuery(
    String type,
    Long categoryId,
    Long bookId
) {
    public GetContentItemsQuery {
        // type: BOOK, CHAPTER, SECTION, or PARAGRAPH; null = all types
        // categoryId: null = all categories
        // bookId: null = all books
    }
}
