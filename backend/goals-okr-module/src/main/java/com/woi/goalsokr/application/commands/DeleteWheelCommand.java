package com.woi.goalsokr.application.commands;

/**
 * Command to delete a wheel
 */
public record DeleteWheelCommand(Long id) {
    public DeleteWheelCommand {
        if (id == null) {
            throw new IllegalArgumentException("Wheel ID cannot be null");
        }
    }
}
