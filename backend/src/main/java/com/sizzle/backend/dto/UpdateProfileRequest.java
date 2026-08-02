package com.sizzle.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @NotBlank(message = "Name cannot be empty")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    private String phone;

    public UpdateProfileRequest() {}

    public UpdateProfileRequest(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public static UpdateProfileRequestBuilder builder() {
        return new UpdateProfileRequestBuilder();
    }

    public static class UpdateProfileRequestBuilder {
        private String name;
        private String phone;

        public UpdateProfileRequestBuilder name(String name) { this.name = name; return this; }
        public UpdateProfileRequestBuilder phone(String phone) { this.phone = phone; return this; }

        public UpdateProfileRequest build() {
            return new UpdateProfileRequest(name, phone);
        }
    }
}
