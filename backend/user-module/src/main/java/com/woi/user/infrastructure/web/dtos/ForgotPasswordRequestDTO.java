package com.woi.user.infrastructure.web.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO for forgot password request
 */
public class ForgotPasswordRequestDTO {
    
    @NotBlank(message = "Email is verplicht")
    @Email(message = "Ongeldig email adres")
    private String email;
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
}

