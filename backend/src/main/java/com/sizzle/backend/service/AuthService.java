package com.sizzle.backend.service;

import com.sizzle.backend.dto.*;
import com.sizzle.backend.model.AccountStatus;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserProfileResponse getUserProfile(String email);

    UserProfileResponse updateUserProfile(String email, UpdateProfileRequest request);

    void changePassword(String email, ChangePasswordRequest request);

    java.util.List<AdminUserResponse> getAllUsers();

    AdminUserResponse updateUserStatus(Long userId, AccountStatus status);
}

