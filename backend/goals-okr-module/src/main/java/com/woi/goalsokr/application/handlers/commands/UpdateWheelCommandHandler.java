package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.UpdateWheelCommand;
import com.woi.goalsokr.application.results.WheelResult;
import com.woi.goalsokr.domain.entities.Wheel;
import com.woi.goalsokr.domain.repositories.WheelRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for updating a wheel
 */
@Component
public class UpdateWheelCommandHandler {

    private final WheelRepository wheelRepository;

    public UpdateWheelCommandHandler(WheelRepository wheelRepository) {
        this.wheelRepository = wheelRepository;
    }

    @Transactional
    public WheelResult handle(UpdateWheelCommand command) {
        Wheel wheel = wheelRepository.findById(command.id())
            .orElseThrow(() -> new IllegalArgumentException("Wheel not found with id: " + command.id()));

        if (wheelRepository.existsByWheelKeyExcludingId(command.wheelKey().trim(), command.id())) {
            throw new IllegalArgumentException("Another wheel with key '" + command.wheelKey() + "' already exists");
        }

        String nameNl = ensureName(command.nameNl(), command.nameEn());
        String nameEn = ensureName(command.nameEn(), command.nameNl());

        wheel.setWheelKey(command.wheelKey().trim());
        wheel.setNameNl(nameNl);
        wheel.setNameEn(nameEn);
        wheel.setDescriptionNl(command.descriptionNl() != null ? command.descriptionNl().trim() : null);
        wheel.setDescriptionEn(command.descriptionEn() != null ? command.descriptionEn().trim() : null);
        wheel.setDisplayOrder(command.displayOrder() != null ? command.displayOrder() : 0);

        Wheel saved = wheelRepository.save(wheel);
        return WheelResult.from(saved);
    }

    private static String ensureName(String primary, String fallback) {
        if (primary != null && !primary.trim().isEmpty()) {
            return primary.trim();
        }
        return fallback != null && !fallback.trim().isEmpty() ? fallback.trim() : "";
    }
}
