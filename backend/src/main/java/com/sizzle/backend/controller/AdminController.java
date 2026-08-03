package com.sizzle.backend.controller;

import com.sizzle.backend.dto.AdminUserResponse;
import com.sizzle.backend.dto.ApiResponse;
import com.sizzle.backend.dto.UpdateAccountStatusRequest;
import com.sizzle.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AuthService authService;

    public AdminController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getAllUsers() {
        List<AdminUserResponse> users = authService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<AdminUserResponse>> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAccountStatusRequest request) {
        AdminUserResponse updatedUser = authService.updateUserStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("User account status updated successfully", updatedUser));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        List<AdminUserResponse> users = authService.getAllUsers();
        long totalUsers = users.size();
        long activeCustomers = users.stream().filter(u -> u.getRole().name().equals("CUSTOMER") && u.getAccountStatus().name().equals("ACTIVE")).count();
        long totalAdmins = users.stream().filter(u -> u.getRole().name().equals("ADMIN")).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeCustomers", activeCustomers);
        stats.put("totalAdmins", totalAdmins);
        stats.put("systemStatus", "ONLINE");
        stats.put("databaseConnected", true);

        return ResponseEntity.ok(ApiResponse.success("Admin stats retrieved successfully", stats));
    }
}
