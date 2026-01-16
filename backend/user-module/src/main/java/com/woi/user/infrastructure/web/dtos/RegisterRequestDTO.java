package com.woi.user.infrastructure.web.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for user registration request
 */
public class RegisterRequestDTO {
    
    @NotBlank(message = "Email is verplicht")
    @Email(message = "Ongeldig email adres")
    private String email;
    
    @NotBlank(message = "Wachtwoord is verplicht")
    @Size(min = 8, max = 128, message = "Wachtwoord moet tussen 8 en 128 tekens lang zijn")
    private String password;
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}

