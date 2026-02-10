package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetAllWheelsQuery;
import com.woi.content.application.results.WheelResult;
import com.woi.content.domain.repositories.WheelRepository;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting all wheels
 */
@Component
public class GetAllWheelsQueryHandler {
    private final WheelRepository wheelRepository;
    
    public GetAllWheelsQueryHandler(WheelRepository wheelRepository) {
        this.wheelRepository = wheelRepository;
    }
    
    public List<WheelResult> handle(GetAllWheelsQuery query) {
        return wheelRepository.findAllOrderedByDisplayOrder().stream()
            .map(WheelResult::from)
            .collect(Collectors.toList());
    }
}
