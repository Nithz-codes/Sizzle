package com.sizzle.backend.controller;

import com.sizzle.backend.dto.ApiResponse;
import com.sizzle.backend.dto.CreateMenuItemRequest;
import com.sizzle.backend.dto.MenuItemResponse;
import com.sizzle.backend.dto.UpdateMenuItemRequest;
import com.sizzle.backend.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getMenuItems(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        List<MenuItemResponse> items = menuService.getMenuItems(categoryId, search);
        return ResponseEntity.ok(ApiResponse.success("Menu items retrieved successfully", items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> getMenuItemById(@PathVariable Long id) {
        MenuItemResponse item = menuService.getMenuItemById(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item retrieved successfully", item));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MenuItemResponse>> createMenuItem(@Valid @RequestBody CreateMenuItemRequest request) {
        MenuItemResponse item = menuService.createMenuItem(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Menu item created successfully", item));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateMenuItem(
            @PathVariable Long id,
            @RequestBody UpdateMenuItemRequest request) {
        MenuItemResponse item = menuService.updateMenuItem(id, request);
        return ResponseEntity.ok(ApiResponse.success("Menu item updated successfully", item));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item deleted successfully", null));
    }
}
