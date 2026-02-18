package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.DeleteKeyResultCommand;
import com.woi.goalsokr.domain.entities.KeyResult;
import com.woi.goalsokr.domain.repositories.KeyResultRepository;
import com.woi.goalsokr.domain.repositories.UserKeyResultInstanceRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Command handler for deleting a key result.
 * Only allowed when no user has started this key result (no UserKeyResultInstance).
 */
@Component
public class DeleteKeyResultCommandHandler {
    private final KeyResultRepository keyResultRepository;
    private final UserKeyResultInstanceRepository userKeyResultInstanceRepository;

    public DeleteKeyResultCommandHandler(
            KeyResultRepository keyResultRepository,
            UserKeyResultInstanceRepository userKeyResultInstanceRepository) {
        this.keyResultRepository = keyResultRepository;
        this.userKeyResultInstanceRepository = userKeyResultInstanceRepository;
    }

    @Transactional
    public void handle(DeleteKeyResultCommand command) {
        KeyResult keyResult = keyResultRepository.findById(command.keyResultId())
            .orElseThrow(() -> new IllegalArgumentException("Key result not found with id: " + command.keyResultId()));

        List<?> instances = userKeyResultInstanceRepository.findByKeyResultId(keyResult.getId());
        if (!instances.isEmpty()) {
            throw new IllegalArgumentException("Cannot delete key result: it is in use. Remove it from all progress boards first.");
        }

        keyResultRepository.delete(keyResult);
    }
}
