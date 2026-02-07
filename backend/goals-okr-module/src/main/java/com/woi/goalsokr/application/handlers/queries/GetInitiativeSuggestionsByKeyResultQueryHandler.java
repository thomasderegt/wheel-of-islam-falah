package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetInitiativeSuggestionsByKeyResultQuery;
import com.woi.goalsokr.application.results.InitiativeSuggestionResult;
import com.woi.goalsokr.domain.repositories.InitiativeSuggestionRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting initiative suggestions by key result
 */
@Component
public class GetInitiativeSuggestionsByKeyResultQueryHandler {
    private final InitiativeSuggestionRepository suggestionRepository;

    public GetInitiativeSuggestionsByKeyResultQueryHandler(InitiativeSuggestionRepository suggestionRepository) {
        this.suggestionRepository = suggestionRepository;
    }

    public List<InitiativeSuggestionResult> handle(GetInitiativeSuggestionsByKeyResultQuery query) {
        return suggestionRepository.findByKeyResultId(query.keyResultId())
                .stream()
                .map(InitiativeSuggestionResult::from)
                .collect(Collectors.toList());
    }
}
