package com.sizzle.backend.controller;

import com.sizzle.backend.dto.ApiResponse;
import com.sizzle.backend.dto.InventoryItemRequest;
import com.sizzle.backend.dto.InventoryItemResponse;
import com.sizzle.backend.dto.RestockRequest;
import com.sizzle.backend.model.StockStatus;
import com.sizzle.backend.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CHEF', 'WAITER')")
    public ResponseEntity<ApiResponse<List<InventoryItemResponse>>> getAllItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) StockStatus status,
            @RequestParam(required = false) String search) {
        List<InventoryItemResponse> items = inventoryService.getAllInventoryItems(category, status, search);
        return ResponseEntity.ok(ApiResponse.success("Inventory items retrieved successfully", items));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CHEF', 'WAITER')")
    public ResponseEntity<ApiResponse<InventoryItemResponse>> getItemById(@PathVariable Long id) {
        InventoryItemResponse item = inventoryService.getInventoryItemById(id);
        return ResponseEntity.ok(ApiResponse.success("Inventory item retrieved successfully", item));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<InventoryItemResponse>> createItem(@Valid @RequestBody InventoryItemRequest request) {
        InventoryItemResponse response = inventoryService.createInventoryItem(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Inventory item created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<InventoryItemResponse>> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody InventoryItemRequest request) {
        InventoryItemResponse response = inventoryService.updateInventoryItem(id, request);
        return ResponseEntity.ok(ApiResponse.success("Inventory item updated successfully", response));
    }

    @PatchMapping("/{id}/restock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<InventoryItemResponse>> restockItem(
            @PathVariable Long id,
            @Valid @RequestBody RestockRequest request) {
        InventoryItemResponse response = inventoryService.restockInventoryItem(id, request);
        return ResponseEntity.ok(ApiResponse.success("Inventory item restocked successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable Long id) {
        inventoryService.deleteInventoryItem(id);
        return ResponseEntity.ok(ApiResponse.success("Inventory item deleted successfully", null));
    }
}
