package com.sizzle.backend.dto;

import com.sizzle.backend.model.Role;

public class AuthResponse {

    private String token;
    private String tokenType;
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;

    public AuthResponse() {}

    public AuthResponse(String token, String tokenType, Long id, String name, String email, String phone, Role role) {
        this.token = token;
        this.tokenType = tokenType;
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private String token;
        private String tokenType = "Bearer";
        private Long id;
        private String name;
        private String email;
        private String phone;
        private Role role;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public AuthResponseBuilder id(Long id) { this.id = id; return this; }
        public AuthResponseBuilder name(String name) { this.name = name; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder phone(String phone) { this.phone = phone; return this; }
        public AuthResponseBuilder role(Role role) { this.role = role; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, tokenType, id, name, email, phone, role);
        }
    }
}
