package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.StartFalahCycleCommand;
import com.woi.user.application.results.FalahCycleResult;
import com.woi.user.domain.entities.FalahCycle;
import com.woi.user.domain.repositories.FalahCycleRepository;
import java.util.List;
import org.springframework.stereotype.Component;

/**
 * Command handler for starting a new Falah growth cycle
 */
@Component
public class StartFalahCycleCommandHandler {
    private final FalahCycleRepository falahCycleRepository;

    public StartFalahCycleCommandHandler(FalahCycleRepository falahCycleRepository) {
        this.falahCycleRepository = falahCycleRepository;
    }

    public FalahCycleResult handle(StartFalahCycleCommand command) {
        List<FalahCycle> activeCycles = falahCycleRepository.findActiveByUserId(command.userId());
        if (!activeCycles.isEmpty()) {
            throw new IllegalArgumentException("You already have an active Falah cycle. Complete it before starting a new one.");
        }
        FalahCycle cycle = FalahCycle.start(command.userId());
        FalahCycle saved = falahCycleRepository.save(cycle);
        return FalahCycleResult.from(saved);
    }
}
