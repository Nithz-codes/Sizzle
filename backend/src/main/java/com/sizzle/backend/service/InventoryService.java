package com.sizzle.backend.service;

import com.sizzle.backend.dto.InventoryItemRequest;
import com.sizzle.backend.dto.InventoryItemResponse;
import com.sizzle.backend.dto.RestockRequest;
import com.sizzle.backend.model.StockStatus;

import java.util.List;

public interface InventoryService {
    List<InventoryItemResponse> getAllInventoryItems(String category, StockStatus status, String search);
    InventoryItemResponse getInventoryItemById(Long id);
    InventoryItemResponse createInventoryItem(InventoryItemRequest request);
    InventoryItemResponse updateInventoryItem(Long id, InventoryItemRequest request);
    InventoryItemResponse restockInventoryItem(Long id, RestockRequest request);
    void deleteInventoryItem(Long id);
}
