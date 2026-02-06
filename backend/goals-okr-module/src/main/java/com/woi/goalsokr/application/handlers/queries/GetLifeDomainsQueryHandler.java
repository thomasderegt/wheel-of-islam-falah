package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetLifeDomainsQuery;
import com.woi.goalsokr.application.results.LifeDomainResult;
import com.woi.goalsokr.domain.repositories.LifeDomainRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting all life domains
 */
@Component("okrGetLifeDomainsQueryHandler")
public class GetLifeDomainsQueryHandler {
    private final LifeDomainRepository lifeDomainRepository;
    
    public GetLifeDomainsQueryHandler(LifeDomainRepository lifeDomainRepository) {
        this.lifeDomainRepository = lifeDomainRepository;
    }
    
    @Transactional(readOnly = true)
    public List<LifeDomainResult> handle(GetLifeDomainsQuery query) {
        return lifeDomainRepository.findAllOrderedByDisplayOrder().stream()
            .map(LifeDomainResult::from)
            .collect(Collectors.toList());
    }
}
