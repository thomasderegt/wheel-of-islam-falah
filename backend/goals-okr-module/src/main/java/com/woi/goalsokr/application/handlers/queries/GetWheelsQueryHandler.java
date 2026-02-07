package com.woi.goalsokr.application.handlers.queries;

import com.woi.goalsokr.application.queries.GetWheelsQuery;
import com.woi.goalsokr.application.results.WheelResult;
import com.woi.goalsokr.domain.repositories.WheelRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Query handler for getting all wheels
 */
@Component("okrGetWheelsQueryHandler")
public class GetWheelsQueryHandler {
    private final WheelRepository wheelRepository;
    
    public GetWheelsQueryHandler(WheelRepository wheelRepository) {
        this.wheelRepository = wheelRepository;
    }
    
    @Transactional(readOnly = true)
    public List<WheelResult> handle(GetWheelsQuery query) {
        return wheelRepository.findAllOrderedByDisplayOrder().stream()
            .map(WheelResult::from)
            .collect(Collectors.toList());
    }
}
