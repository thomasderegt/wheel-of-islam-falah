package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.ExitFalahCycleFlowCommand;
import com.woi.user.application.results.FalahCycleResult;
import com.woi.user.domain.entities.FalahCycle;
import com.woi.user.domain.repositories.FalahCycleRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Command handler for exiting the Falah cycle creation flow (Finish)
 */
@Component
public class ExitFalahCycleFlowCommandHandler {
    private final FalahCycleRepository falahCycleRepository;

    public ExitFalahCycleFlowCommandHandler(FalahCycleRepository falahCycleRepository) {
        this.falahCycleRepository = falahCycleRepository;
    }

    public FalahCycleResult handle(ExitFalahCycleFlowCommand command) {
        Optional<FalahCycle> opt = falahCycleRepository.findById(command.cycleId());
        if (opt.isEmpty()) {
            throw new IllegalArgumentException("Falah cycle not found: " + command.cycleId());
        }
        FalahCycle cycle = opt.get();
        if (!cycle.getUserId().equals(command.userId())) {
            throw new IllegalArgumentException("Falah cycle does not belong to user");
        }
        if (!cycle.isActive()) {
            throw new IllegalArgumentException("Falah cycle is already completed");
        }
        cycle.exitFlow();
        FalahCycle saved = falahCycleRepository.save(cycle);
        return FalahCycleResult.from(saved);
    }
}
