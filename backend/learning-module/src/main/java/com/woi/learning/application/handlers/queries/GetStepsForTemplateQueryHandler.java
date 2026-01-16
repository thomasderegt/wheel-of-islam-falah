package com.woi.learning.application.handlers.queries;

import com.woi.learning.application.queries.GetStepsForTemplateQuery;
import com.woi.learning.application.results.LearningFlowStepResult;
import com.woi.learning.domain.repositories.LearningFlowStepRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting all steps for a template
 */
@Component
public class GetStepsForTemplateQueryHandler {
    private final LearningFlowStepRepository stepRepository;
    
    public GetStepsForTemplateQueryHandler(LearningFlowStepRepository stepRepository) {
        this.stepRepository = stepRepository;
    }
    
    @Transactional(readOnly = true)
    public List<LearningFlowStepResult> handle(GetStepsForTemplateQuery query) {
        return stepRepository.findByTemplateIdOrderByOrderIndex(query.templateId()).stream()
            .map(LearningFlowStepResult::from)
            .collect(Collectors.toList());
    }
}

