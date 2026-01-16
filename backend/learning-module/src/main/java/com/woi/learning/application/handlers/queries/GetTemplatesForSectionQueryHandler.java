package com.woi.learning.application.handlers.queries;

import com.woi.learning.application.queries.GetTemplatesForSectionQuery;
import com.woi.learning.application.results.LearningFlowTemplateResult;
import com.woi.learning.domain.repositories.LearningFlowTemplateRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting all templates for a specific section
 */
@Component
public class GetTemplatesForSectionQueryHandler {
    private final LearningFlowTemplateRepository templateRepository;
    
    public GetTemplatesForSectionQueryHandler(LearningFlowTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }
    
    @Transactional(readOnly = true)
    public List<LearningFlowTemplateResult> handle(GetTemplatesForSectionQuery query) {
        return templateRepository.findBySectionId(query.sectionId()).stream()
            .map(LearningFlowTemplateResult::from)
            .collect(Collectors.toList());
    }
}

