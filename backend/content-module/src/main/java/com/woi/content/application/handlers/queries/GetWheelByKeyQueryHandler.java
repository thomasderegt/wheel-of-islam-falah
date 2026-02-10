package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetWheelByKeyQuery;
import com.woi.content.application.results.WheelResult;
import com.woi.content.domain.repositories.WheelRepository;

import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Query handler for getting a wheel by wheel key
 */
@Component
public class GetWheelByKeyQueryHandler {
    private final WheelRepository wheelRepository;
    
    public GetWheelByKeyQueryHandler(WheelRepository wheelRepository) {
        this.wheelRepository = wheelRepository;
    }
    
    public Optional<WheelResult> handle(GetWheelByKeyQuery query) {
        return wheelRepository.findByWheelKey(query.wheelKey())
            .map(WheelResult::from);
    }
}
