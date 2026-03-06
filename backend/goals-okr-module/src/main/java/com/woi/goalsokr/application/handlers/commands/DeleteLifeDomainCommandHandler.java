package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.DeleteLifeDomainCommand;
import com.woi.goalsokr.domain.repositories.LifeDomainRepository;
import com.woi.goalsokr.domain.repositories.ObjectiveRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for deleting a life domain.
 * Fails if the life domain has objectives (delete those first).
 */
@Component
public class DeleteLifeDomainCommandHandler {

    private final LifeDomainRepository lifeDomainRepository;
    private final ObjectiveRepository objectiveRepository;

    public DeleteLifeDomainCommandHandler(LifeDomainRepository lifeDomainRepository, ObjectiveRepository objectiveRepository) {
        this.lifeDomainRepository = lifeDomainRepository;
        this.objectiveRepository = objectiveRepository;
    }

    @Transactional
    public void handle(DeleteLifeDomainCommand command) {
        if (lifeDomainRepository.findById(command.id()).isEmpty()) {
            throw new IllegalArgumentException("Life domain not found with id: " + command.id());
        }

        var objectives = objectiveRepository.findByLifeDomainId(command.id());
        if (!objectives.isEmpty()) {
            throw new IllegalStateException(
                "Cannot delete life domain: it has " + objectives.size() + " objective(s). Delete those first.");
        }

        lifeDomainRepository.deleteById(command.id());
    }
}
