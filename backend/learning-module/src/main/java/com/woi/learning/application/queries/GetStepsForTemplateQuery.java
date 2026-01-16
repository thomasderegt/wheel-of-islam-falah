package com.woi.learning.application.queries;

/**
 * Query for getting all steps for a template
 */
public record GetStepsForTemplateQuery(
    Long templateId
) {
    public GetStepsForTemplateQuery {
        if (templateId == null) {
            throw new IllegalArgumentException("TemplateId cannot be null");
        }
    }
}

