package com.woi.learning.application.handlers.queries;

import com.woi.learning.application.queries.GetTemplateQuery;
import com.woi.learning.application.results.LearningFlowTemplateResult;
import com.woi.learning.domain.repositories.LearningFlowTemplateRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Query handler for getting a template by ID
 */
@Component
public class GetTemplateQueryHandler {
    private final LearningFlowTemplateRepository templateRepository;
    
    public GetTemplateQueryHandler(LearningFlowTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }
    
    @Transactional(readOnly = true)
    public LearningFlowTemplateResult handle(GetTemplateQuery query) {
        return templateRepository.findById(query.templateId())
            .map(LearningFlowTemplateResult::from)
            .orElseThrow(() -> new IllegalArgumentException("Template not found: " + query.templateId()));
    }
}

