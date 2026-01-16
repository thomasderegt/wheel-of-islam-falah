package com.woi.user.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for change password request
 */
public class ChangePasswordRequestDTO {
    
    @NotBlank(message = "Oud wachtwoord is verplicht")
    private String oldPassword;
    
    @NotBlank(message = "Nieuw wachtwoord is verplicht")
    @Size(min = 8, max = 128, message = "Wachtwoord moet tussen 8 en 128 tekens lang zijn")
    private String newPassword;
    
    public String getOldPassword() {
        return oldPassword;
    }
    
    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }
    
    public String getNewPassword() {
        return newPassword;
    }
    
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

