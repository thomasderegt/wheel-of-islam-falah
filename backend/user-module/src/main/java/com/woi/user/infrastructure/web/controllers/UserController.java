package com.woi.user.infrastructure.web.controllers;

import com.woi.user.application.commands.ChangePasswordCommand;
import com.woi.user.application.commands.ForgotPasswordCommand;
import com.woi.user.application.commands.LoginCommand;
import com.woi.user.application.commands.RefreshTokenCommand;
import com.woi.user.application.commands.RegisterUserCommand;
import com.woi.user.application.commands.ResetPasswordCommand;
import com.woi.user.application.handlers.commands.ChangePasswordCommandHandler;
import com.woi.user.application.handlers.commands.ForgotPasswordCommandHandler;
import com.woi.user.application.handlers.commands.LoginCommandHandler;
import com.woi.user.application.handlers.commands.RefreshTokenCommandHandler;
import com.woi.user.application.handlers.commands.RegisterUserCommandHandler;
import com.woi.user.application.handlers.commands.ResetPasswordCommandHandler;
import com.woi.user.application.handlers.queries.GetUserQueryHandler;
import com.woi.user.application.handlers.queries.GetUserPreferencesQueryHandler;
import com.woi.user.application.handlers.commands.UpdateUserPreferencesCommandHandler;
import com.woi.user.application.queries.GetUserQuery;
import com.woi.user.application.queries.GetUserPreferencesQuery;
import com.woi.user.application.commands.UpdateUserPreferencesCommand;
import com.woi.user.application.results.AuthResult;
import com.woi.user.application.results.UserResult;
import com.woi.user.application.results.UserPreferenceResult;
import com.woi.user.infrastructure.web.dtos.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for User Management
 * Uses CQRS-lite pattern: Commands/Queries → Handlers → Use Cases
 */
@RestController
@RequestMapping("/api/v2/user")
@CrossOrigin(origins = "*")
public class UserController {
    
    private final RegisterUserCommandHandler registerHandler;
    private final LoginCommandHandler loginHandler;
    private final RefreshTokenCommandHandler refreshTokenHandler;
    private final ForgotPasswordCommandHandler forgotPasswordHandler;
    private final ResetPasswordCommandHandler resetPasswordHandler;
    private final ChangePasswordCommandHandler changePasswordHandler;
    private final GetUserQueryHandler getUserHandler;
    private final GetUserPreferencesQueryHandler getUserPreferencesHandler;
    private final UpdateUserPreferencesCommandHandler updateUserPreferencesHandler;
    
    public UserController(
            RegisterUserCommandHandler registerHandler,
            LoginCommandHandler loginHandler,
            RefreshTokenCommandHandler refreshTokenHandler,
            ForgotPasswordCommandHandler forgotPasswordHandler,
            ResetPasswordCommandHandler resetPasswordHandler,
            ChangePasswordCommandHandler changePasswordHandler,
            GetUserQueryHandler getUserHandler,
            GetUserPreferencesQueryHandler getUserPreferencesHandler,
            UpdateUserPreferencesCommandHandler updateUserPreferencesHandler) {
        this.registerHandler = registerHandler;
        this.loginHandler = loginHandler;
        this.refreshTokenHandler = refreshTokenHandler;
        this.forgotPasswordHandler = forgotPasswordHandler;
        this.resetPasswordHandler = resetPasswordHandler;
        this.changePasswordHandler = changePasswordHandler;
        this.getUserHandler = getUserHandler;
        this.getUserPreferencesHandler = getUserPreferencesHandler;
        this.updateUserPreferencesHandler = updateUserPreferencesHandler;
    }
    
    /**
     * Get client IP address from request
     * Helper method for extracting request metadata
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
    
    /**
     * Register a new user
     * POST /api/v2/user/register
     * 
     * Controller responsibility: HTTP → Command mapping, Result → DTO mapping
     * Business logic is handled by use case (via handler)
     */
    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequestDTO request,
            BindingResult bindingResult,
            HttpServletRequest httpRequest) {
        try {
            // Check for validation errors (syntactical validation only)
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            // Extract request metadata for audit logging
            String clientIp = getClientIpAddress(httpRequest);
            String userAgent = httpRequest.getHeader("User-Agent");
            
            // Create command (includes metadata for audit logging)
            RegisterUserCommand command = new RegisterUserCommand(
                request.getEmail(),
                request.getPassword(),
                clientIp,
                userAgent
            );
            
            // Handle command (use case handles business logic and audit logging)
            UserResult result = registerHandler.handle(command);
            
            // Convert to response DTO
            RegisterResponseDTO response = toRegisterResponseDTO(result);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij de registratie. Probeer het later opnieuw."));
        }
    }
    
    /**
     * Login endpoint
     * POST /api/v2/user/login
     * 
     * Controller responsibility: HTTP → Command mapping, Result → DTO mapping
     * Business logic is handled by use case (via handler)
     */
    @PostMapping("/login")
    @Transactional
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequestDTO request,
            BindingResult bindingResult,
            HttpServletRequest httpRequest) {
        try {
            // Check for validation errors (syntactical validation only)
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            // Extract request metadata
            String clientIp = getClientIpAddress(httpRequest);
            String userAgent = httpRequest.getHeader("User-Agent");
            
            // Create command
            LoginCommand command = new LoginCommand(
                request.getEmail(),
                request.getPassword(),
                clientIp,
                userAgent
            );
            
            // Handle command (use case handles business logic)
            AuthResult authResult = loginHandler.handle(command);
            
            // Convert to response DTO
            LoginResponseDTO response = toLoginResponseDTO(authResult);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het inloggen. Probeer het later opnieuw."));
        }
    }
    
    /**
     * Refresh access token
     * POST /api/v2/user/refresh
     */
    @PostMapping("/refresh")
    @Transactional
    public ResponseEntity<?> refreshToken(
            @Valid @RequestBody RefreshTokenRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            RefreshTokenCommand command = new RefreshTokenCommand(request.getRefreshToken());
            AuthResult authResult = refreshTokenHandler.handle(command);
            
            LoginResponseDTO response = toLoginResponseDTO(authResult);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het verversen van de token."));
        }
    }
    
    /**
     * Request password reset
     * POST /api/v2/user/forgot-password
     */
    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            ForgotPasswordCommand command = new ForgotPasswordCommand(request.getEmail());
            forgotPasswordHandler.handle(command);
            
            // Always return success (security best practice - don't reveal if user exists)
            return ResponseEntity.ok(Map.of("message", "Als dit email adres bestaat, is er een reset link verzonden."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden."));
        }
    }
    
    /**
     * Reset password with token
     * POST /api/v2/user/reset-password
     */
    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            ResetPasswordCommand command = new ResetPasswordCommand(
                request.getToken(),
                request.getNewPassword()
            );
            resetPasswordHandler.handle(command);
            
            return ResponseEntity.ok(Map.of("message", "Wachtwoord is succesvol gewijzigd."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het resetten van het wachtwoord."));
        }
    }
    
    /**
     * Change password (when logged in)
     * POST /api/v2/user/change-password
     * 
     * Note: userId should come from JWT token (security context)
     * For now, we'll need to add it to the request or extract from security context
     */
    @PostMapping("/change-password")
    @Transactional
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequestDTO request,
            BindingResult bindingResult,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        try {
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Gebruiker niet geauthenticeerd"));
            }
            
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            ChangePasswordCommand command = new ChangePasswordCommand(
                userId,
                request.getOldPassword(),
                request.getNewPassword()
            );
            changePasswordHandler.handle(command);
            
            return ResponseEntity.ok(Map.of("message", "Wachtwoord is succesvol gewijzigd."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het wijzigen van het wachtwoord."));
        }
    }
    
    /**
     * Get user by ID
     * GET /api/v2/user/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable Long id) {
        GetUserQuery query = new GetUserQuery(id);
        Optional<UserResult> result = getUserHandler.handle(query);
        
        return result.map(r -> ResponseEntity.ok(toUserResponseDTO(r)))
                     .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get user preferences by user ID
     * GET /api/v2/user/{id}/preferences
     * Creates default preferences if they don't exist
     */
    @GetMapping("/{id}/preferences")
    public ResponseEntity<UserPreferenceResponseDTO> getUserPreferences(@PathVariable Long id) {
        try {
            GetUserPreferencesQuery query = new GetUserPreferencesQuery(id);
            UserPreferenceResult result = getUserPreferencesHandler.handle(query);
            return ResponseEntity.ok(toUserPreferenceResponseDTO(result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Update user preferences
     * PUT /api/v2/user/{id}/preferences
     * Creates preferences if they don't exist
     */
    @PutMapping("/{id}/preferences")
    @Transactional
    public ResponseEntity<?> updateUserPreferences(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserPreferencesRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            // Context is always SUCCESS (Content Context)
            UpdateUserPreferencesCommand command = new UpdateUserPreferencesCommand(
                id,
                com.woi.user.domain.enums.Context.SUCCESS,
                request.getDefaultGoalsOkrContext() // Can be null, will default to NONE
            );
            
            UserPreferenceResult result = updateUserPreferencesHandler.handle(command);
            return ResponseEntity.ok(toUserPreferenceResponseDTO(result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het bijwerken van de voorkeuren."));
        }
    }
    
    // Mapper methods
    private RegisterResponseDTO toRegisterResponseDTO(UserResult result) {
        RegisterResponseDTO dto = new RegisterResponseDTO();
        dto.setId(result.id());
        dto.setEmail(result.email());
        dto.setProfileName(result.profileName());
        dto.setStatus(result.status());
        dto.setCreatedAt(result.createdAt());
        return dto;
    }
    
    private LoginResponseDTO toLoginResponseDTO(AuthResult result) {
        LoginResponseDTO dto = new LoginResponseDTO();
        dto.setUserId(result.userId());
        dto.setEmail(result.email());
        dto.setToken(result.token());
        dto.setRefreshToken(result.refreshToken());
        dto.setExpiresAt(result.expiresAt());
        return dto;
    }
    
    private UserResponseDTO toUserResponseDTO(UserResult result) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(result.id());
        dto.setEmail(result.email());
        dto.setProfileName(result.profileName());
        dto.setStatus(result.status());
        dto.setCreatedAt(result.createdAt());
        dto.setUpdatedAt(result.updatedAt());
        return dto;
    }
    
    private UserPreferenceResponseDTO toUserPreferenceResponseDTO(UserPreferenceResult result) {
        UserPreferenceResponseDTO dto = new UserPreferenceResponseDTO();
        dto.setId(result.id());
        dto.setUserId(result.userId());
        // defaultMode is no longer exposed in API (always SUCCESS)
        dto.setDefaultContext(result.defaultContext()); // Always SUCCESS (Content Context)
        dto.setDefaultGoalsOkrContext(result.defaultGoalsOkrContext());
        dto.setCreatedAt(result.createdAt());
        dto.setUpdatedAt(result.updatedAt());
        return dto;
    }
}

