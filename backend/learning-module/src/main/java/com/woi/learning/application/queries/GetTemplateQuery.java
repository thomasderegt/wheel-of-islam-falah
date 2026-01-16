package com.woi.learning.application.queries;

/**
 * Query for getting a template by ID
 */
public record GetTemplateQuery(
    Long templateId
) {
    public GetTemplateQuery {
        if (templateId == null) {
            throw new IllegalArgumentException("TemplateId cannot be null");
        }
    }
}

