package com.woi.goalsokr.api;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Public interface for Goals OKR module
 * This is the contract that other modules can use to interact with OKR goals
 *
 * OKR Structure:
 * Life Domain → Objective → KeyResult → Initiative
 */
public interface GoalsOKRModuleInterface {

    // ========== Objectives (Templates) ==========

    /**
     * Create a new objective
     * @param lifeDomainId Life Domain ID
     * @param titleNl Dutch title
     * @param titleEn English title
     * @param descriptionNl Dutch description (optional)
     * @param descriptionEn English description (optional)
     * @param orderIndex Order index within the life domain
     * @return The created objective summary
     */
    ObjectiveSummary createObjective(Long lifeDomainId, String titleNl, String titleEn, 
                                     String descriptionNl, String descriptionEn, Integer orderIndex);

    /**
     * Get all objectives for a life domain
     * @param lifeDomainId Life Domain ID
     * @return List of objectives for that life domain
     */
    List<ObjectiveSummary> getObjectivesByLifeDomain(Long lifeDomainId);

    /**
     * Get an objective by ID
     * @param objectiveId Objective ID
     * @return Optional containing the objective if found
     */
    Optional<ObjectiveSummary> getObjective(Long objectiveId);

    // ========== Key Results (Templates) ==========

    /**
     * Create a new key result
     * @param objectiveId Objective ID
     * @param titleNl Dutch title
     * @param titleEn English title
     * @param descriptionNl Dutch description (optional)
     * @param descriptionEn English description (optional)
     * @param targetValue Target value (required, must be positive)
     * @param unit Unit of measurement (e.g., "dagen", "uren", "euro")
     * @param orderIndex Order index within the objective
     * @return The created key result summary
     */
    KeyResultSummary createKeyResult(Long objectiveId, String titleNl, String titleEn,
                                     String descriptionNl, String descriptionEn,
                                     BigDecimal targetValue, String unit, Integer orderIndex);

    /**
     * Get a key result by ID
     * @param keyResultId Key result ID
     * @return Optional containing the key result if found
     */
    Optional<KeyResultSummary> getKeyResult(Long keyResultId);

    /**
     * Get all key results for an objective
     * @param objectiveId Objective ID
     * @return List of key results for that objective
     */
    List<KeyResultSummary> getKeyResultsByObjective(Long objectiveId);

    // ========== User Objective Instances (User-specific) ==========

    /**
     * Start a new user objective instance
     * @param userId User ID
     * @param objectiveId Objective ID (template)
     * @return The created user objective instance summary
     */
    UserObjectiveInstanceSummary startUserObjectiveInstance(Long userId, Long objectiveId);

    /**
     * Get a user objective instance by ID
     * @param userObjectiveInstanceId User objective instance ID
     * @return Optional containing the user objective instance if found
     */
    Optional<UserObjectiveInstanceSummary> getUserObjectiveInstance(Long userObjectiveInstanceId);

    /**
     * Get all user objective instances for a user
     * @param userId User ID
     * @return List of user objective instances for that user
     */
    List<UserObjectiveInstanceSummary> getUserObjectiveInstancesForUser(Long userId);

    /**
     * Complete a user objective instance
     * @param userObjectiveInstanceId User objective instance ID
     * @return Updated user objective instance summary
     */
    UserObjectiveInstanceSummary completeUserObjectiveInstance(Long userObjectiveInstanceId);

    // ========== User Key Result Instances (User-specific) ==========

    /**
     * Start a new user key result instance
     * @param userId User ID (for validation)
     * @param userObjectiveInstanceId User objective instance ID
     * @param keyResultId Key result ID (template)
     * @return The created user key result instance summary
     */
    UserKeyResultInstanceSummary startUserKeyResultInstance(Long userId, Long userObjectiveInstanceId, Long keyResultId);

    /**
     * Get a user key result instance by ID
     * @param userKeyResultInstanceId User key result instance ID
     * @return Optional containing the user key result instance if found
     */
    Optional<UserKeyResultInstanceSummary> getUserKeyResultInstance(Long userKeyResultInstanceId);

    /**
     * Get all user key result instances for a user
     * @param userId User ID
     * @return List of user key result instances for that user
     */
    List<UserKeyResultInstanceSummary> getUserKeyResultInstancesForUser(Long userId);

    /**
     * Complete a user key result instance
     * @param userKeyResultInstanceId User key result instance ID
     * @return Updated user key result instance summary
     */
    UserKeyResultInstanceSummary completeUserKeyResultInstance(Long userKeyResultInstanceId);

    // ========== User Initiative Instances (User-specific) ==========

    /**
     * Start a new user initiative instance
     * @param userId User ID (for validation)
     * @param userKeyResultInstanceId User key result instance ID
     * @param initiativeId Initiative ID
     * @return The created user initiative instance summary
     */
    UserInitiativeInstanceSummary startUserInitiativeInstance(Long userId, Long userKeyResultInstanceId, Long initiativeId);

    /**
     * Get a user initiative instance by ID
     * @param userInitiativeInstanceId User initiative instance ID
     * @return Optional containing the user initiative instance if found
     */
    Optional<UserInitiativeInstanceSummary> getUserInitiativeInstance(Long userInitiativeInstanceId);

    /**
     * Get all user initiative instances for a user
     * @param userId User ID
     * @return List of user initiative instances for that user
     */
    List<UserInitiativeInstanceSummary> getUserInitiativeInstancesForUser(Long userId);

    /**
     * Complete a user initiative instance
     * @param userInitiativeInstanceId User initiative instance ID
     * @return Updated user initiative instance summary
     */
    UserInitiativeInstanceSummary completeUserInitiativeInstance(Long userInitiativeInstanceId);

    // ========== Initiatives (User-specific) ==========

    /**
     * Create a new initiative
     * @param userId User ID
     * @param keyResultId Key result ID (template reference)
     * @param userKeyResultInstanceId User key result instance ID
     * @param title Initiative title
     * @param description Initiative description (optional)
     * @param targetDate Target date (optional)
     * @return The created initiative summary
     */
    InitiativeSummary createInitiative(Long userId, Long keyResultId, Long userKeyResultInstanceId,
                                       String title, String description, LocalDate targetDate);

    /**
     * Get an initiative by ID
     * @param initiativeId Initiative ID
     * @return Optional containing the initiative if found
     */
    Optional<InitiativeSummary> getInitiative(Long initiativeId);

    /**
     * Get all initiatives for a user
     * @param userId User ID
     * @return List of initiatives for that user
     */
    List<InitiativeSummary> getInitiativesForUser(Long userId);

    /**
     * Get all initiatives for a user key result instance
     * @param userKeyResultInstanceId User key result instance ID
     * @return List of initiatives for that instance
     */
    List<InitiativeSummary> getInitiativesByUserKeyResultInstance(Long userKeyResultInstanceId);

    /**
     * Update an initiative
     * @param initiativeId Initiative ID
     * @param title New title (optional, null to keep existing)
     * @param description New description (optional, null to keep existing)
     * @param targetDate New target date (optional, null to keep existing)
     * @return Updated initiative summary
     * @throws IllegalArgumentException if initiative not found
     */
    InitiativeSummary updateInitiative(Long initiativeId, String title, String description, LocalDate targetDate);

    /**
     * Complete an initiative
     * @param initiativeId Initiative ID
     * @return Updated initiative summary
     * @throws IllegalArgumentException if initiative not found
     */
    InitiativeSummary completeInitiative(Long initiativeId);

    // ========== Key Result Progress ==========

    /**
     * Get key result progress
     * @param userId User ID
     * @param keyResultId Key result ID
     * @param userKeyResultInstanceId User key result instance ID
     * @return Optional containing the progress if found
     */
    Optional<KeyResultProgressSummary> getKeyResultProgress(Long userId, Long keyResultId, Long userKeyResultInstanceId);

    /**
     * Update key result progress
     * @param userId User ID
     * @param keyResultId Key result ID
     * @param userKeyResultInstanceId User key result instance ID
     * @param currentValue Current progress value (can be null, must be >= 0 if set)
     * @return Updated or created progress summary
     * @throws IllegalArgumentException if key result or user instance not found
     */
    KeyResultProgressSummary updateKeyResultProgress(Long userId, Long keyResultId, Long userKeyResultInstanceId, BigDecimal currentValue);

    // ========== Kanban Items ==========

    /**
     * Get all kanban items for a user
     * @param userId User ID
     * @return List of kanban items for that user
     */
    List<KanbanItemSummary> getKanbanItemsByUser(Long userId);

    /**
     * Add a kanban item
     * @param userId User ID
     * @param itemType Item type (GOAL, OBJECTIVE, KEY_RESULT, INITIATIVE)
     * @param itemId Item ID
     * @return The created kanban item summary
     * @throws IllegalArgumentException if item already exists or invalid parameters
     */
    KanbanItemSummary addKanbanItem(Long userId, String itemType, Long itemId);

    /**
     * Update kanban item position
     * @param itemId Kanban item ID
     * @param columnName Column name (TODO, IN_PROGRESS, IN_REVIEW, DONE)
     * @param position Position within the column
     * @return Updated kanban item summary
     * @throws IllegalArgumentException if item not found or invalid parameters
     */
    KanbanItemSummary updateKanbanItemPosition(Long itemId, String columnName, Integer position);

    /**
     * Delete a kanban item
     * @param itemId Kanban item ID
     * @throws IllegalArgumentException if item not found
     */
    void deleteKanbanItem(Long itemId);
}
