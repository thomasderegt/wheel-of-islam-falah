package com.woi.user.application.handlers.commands;

import com.woi.user.application.commands.CompleteFalahCycleCommand;
import com.woi.user.application.results.FalahCycleResult;
import com.woi.user.domain.entities.FalahCycle;
import com.woi.user.domain.repositories.FalahCycleRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Command handler for completing a Falah growth cycle
 */
@Component
public class CompleteFalahCycleCommandHandler {
    private final FalahCycleRepository falahCycleRepository;

    public CompleteFalahCycleCommandHandler(FalahCycleRepository falahCycleRepository) {
        this.falahCycleRepository = falahCycleRepository;
    }

    public FalahCycleResult handle(CompleteFalahCycleCommand command) {
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
        cycle.complete();
        FalahCycle saved = falahCycleRepository.save(cycle);
        return FalahCycleResult.from(saved);
    }
}
