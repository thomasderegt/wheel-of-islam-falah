package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CreateWheelCommand;
import com.woi.goalsokr.application.results.WheelResult;
import com.woi.goalsokr.domain.entities.Wheel;
import com.woi.goalsokr.domain.repositories.WheelRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Command handler for creating a wheel
 */
@Component
public class CreateWheelCommandHandler {

    private final WheelRepository wheelRepository;

    public CreateWheelCommandHandler(WheelRepository wheelRepository) {
        this.wheelRepository = wheelRepository;
    }

    @Transactional
    public WheelResult handle(CreateWheelCommand command) {
        if (wheelRepository.findByWheelKey(command.wheelKey()).isPresent()) {
            throw new IllegalArgumentException("Wheel with key '" + command.wheelKey() + "' already exists");
        }

        String nameNl = ensureName(command.nameNl(), command.nameEn());
        String nameEn = ensureName(command.nameEn(), command.nameNl());

        Wheel wheel = new Wheel();
        wheel.setWheelKey(command.wheelKey().trim());
        wheel.setNameNl(nameNl);
        wheel.setNameEn(nameEn);
        wheel.setDescriptionNl(command.descriptionNl() != null ? command.descriptionNl().trim() : null);
        wheel.setDescriptionEn(command.descriptionEn() != null ? command.descriptionEn().trim() : null);
        wheel.setDisplayOrder(command.displayOrder() != null ? command.displayOrder() : 0);
        wheel.setCreatedAt(LocalDateTime.now());

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
