package com.sizzle.backend.controller;

import com.sizzle.backend.dto.ApiResponse;
import com.sizzle.backend.dto.UpdateProfileRequest;
import com.sizzle.backend.dto.UserProfileResponse;
import com.sizzle.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserProfileResponse response = authService.getUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse response = authService.updateUserProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("User profile updated successfully", response));
    }
}
