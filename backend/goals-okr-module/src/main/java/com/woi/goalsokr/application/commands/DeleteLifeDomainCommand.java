package com.woi.goalsokr.application.commands;

/**
 * Command to delete a life domain
 */
public record DeleteLifeDomainCommand(Long id) {
    public DeleteLifeDomainCommand {
        if (id == null) {
            throw new IllegalArgumentException("Life domain ID cannot be null");
        }
    }
}
