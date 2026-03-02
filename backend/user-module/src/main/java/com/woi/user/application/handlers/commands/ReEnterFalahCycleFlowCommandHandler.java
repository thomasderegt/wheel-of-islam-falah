package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.ReEnterFalahCycleFlowCommand;
import com.woi.user.application.results.FalahCycleResult;
import com.woi.user.domain.entities.FalahCycle;
import com.woi.user.domain.repositories.FalahCycleRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Command handler for re-entering the Falah cycle creation flow (Continue)
 */
@Component
public class ReEnterFalahCycleFlowCommandHandler {
    private final FalahCycleRepository falahCycleRepository;

    public ReEnterFalahCycleFlowCommandHandler(FalahCycleRepository falahCycleRepository) {
        this.falahCycleRepository = falahCycleRepository;
    }

    public FalahCycleResult handle(ReEnterFalahCycleFlowCommand command) {
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
        cycle.reEnterFlow();
        FalahCycle saved = falahCycleRepository.save(cycle);
        return FalahCycleResult.from(saved);
    }
}
