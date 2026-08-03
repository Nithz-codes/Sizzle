package com.sizzle.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @NotBlank(message = "Name cannot be empty")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    private String phone;
    private String address;
    private String avatarUrl;

    public UpdateProfileRequest() {}

    public UpdateProfileRequest(String name, String phone, String address, String avatarUrl) {
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.avatarUrl = avatarUrl;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public static UpdateProfileRequestBuilder builder() {
        return new UpdateProfileRequestBuilder();
    }

    public static class UpdateProfileRequestBuilder {
        private String name;
        private String phone;
        private String address;
        private String avatarUrl;

        public UpdateProfileRequestBuilder name(String name) { this.name = name; return this; }
        public UpdateProfileRequestBuilder phone(String phone) { this.phone = phone; return this; }
        public UpdateProfileRequestBuilder address(String address) { this.address = address; return this; }
        public UpdateProfileRequestBuilder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }

        public UpdateProfileRequest build() {
            return new UpdateProfileRequest(name, phone, address, avatarUrl);
        }
    }
}
