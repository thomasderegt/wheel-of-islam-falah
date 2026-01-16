package com.woi.user.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for reset password request
 */
public class ResetPasswordRequestDTO {
    
    @NotBlank(message = "Token is verplicht")
    private String token;
    
    @NotBlank(message = "Nieuw wachtwoord is verplicht")
    @Size(min = 8, max = 128, message = "Wachtwoord moet tussen 8 en 128 tekens lang zijn")
    private String newPassword;
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getNewPassword() {
        return newPassword;
    }
    
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

