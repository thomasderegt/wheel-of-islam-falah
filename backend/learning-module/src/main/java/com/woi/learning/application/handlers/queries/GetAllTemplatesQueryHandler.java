package com.woi.learning.application.handlers.queries;

import com.woi.learning.application.queries.GetAllTemplatesQuery;
import com.woi.learning.application.results.LearningFlowTemplateResult;
import com.woi.learning.domain.repositories.LearningFlowTemplateRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting all templates
 */
@Component
public class GetAllTemplatesQueryHandler {
    private final LearningFlowTemplateRepository templateRepository;
    
    public GetAllTemplatesQueryHandler(LearningFlowTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }
    
    @Transactional(readOnly = true)
    public List<LearningFlowTemplateResult> handle(GetAllTemplatesQuery query) {
        return templateRepository.findAll().stream()
            .map(LearningFlowTemplateResult::from)
            .collect(Collectors.toList());
    }
}

