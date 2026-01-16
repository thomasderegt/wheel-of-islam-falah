package com.woi.content.application.queries;

/**
 * Query for getting all public categories (only PUBLISHED content)
 * Returns only content that has been published (status = PUBLISHED)
 * No fallback to working versions - ensures students only see published content
 */
public record GetPublicCategoriesQuery() {
}

