package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.infrastructure.persistence.entities.PasswordResetTokenJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for PasswordResetTokenJpaEntity
 */
@Repository
public interface PasswordResetTokenJpaRepository extends JpaRepository<PasswordResetTokenJpaEntity, Long> {
    Optional<PasswordResetTokenJpaEntity> findByTokenHash(String tokenHash);
    
    @Query("SELECT prt FROM PasswordResetTokenJpaEntity prt WHERE prt.userId = :userId AND prt.usedAt IS NULL AND prt.expiresAt > :now")
    List<PasswordResetTokenJpaEntity> findActiveTokensByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    @Modifying
    @Query("UPDATE PasswordResetTokenJpaEntity prt SET prt.usedAt = :now WHERE prt.userId = :userId AND prt.usedAt IS NULL")
    int revokeAllActiveTokensByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    @Modifying
    @Query("DELETE FROM PasswordResetTokenJpaEntity prt WHERE prt.expiresAt < :now")
    int deleteExpiredTokens(@Param("now") LocalDateTime now);
}

