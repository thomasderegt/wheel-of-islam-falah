package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.DeleteWheelCommand;
import com.woi.goalsokr.domain.repositories.LifeDomainRepository;
import com.woi.goalsokr.domain.repositories.WheelRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for deleting a wheel.
 * Fails if the wheel has life domains (delete those first).
 */
@Component
public class DeleteWheelCommandHandler {

    private final WheelRepository wheelRepository;
    private final LifeDomainRepository lifeDomainRepository;

    public DeleteWheelCommandHandler(WheelRepository wheelRepository, LifeDomainRepository lifeDomainRepository) {
        this.wheelRepository = wheelRepository;
        this.lifeDomainRepository = lifeDomainRepository;
    }

    @Transactional
    public void handle(DeleteWheelCommand command) {
        if (wheelRepository.findById(command.id()).isEmpty()) {
            throw new IllegalArgumentException("Wheel not found with id: " + command.id());
        }

        var lifeDomains = lifeDomainRepository.findByWheelId(command.id());
        if (!lifeDomains.isEmpty()) {
            throw new IllegalStateException(
                "Cannot delete wheel: it has " + lifeDomains.size() + " life domain(s). Delete those first.");
        }

        wheelRepository.deleteById(command.id());
    }
}
