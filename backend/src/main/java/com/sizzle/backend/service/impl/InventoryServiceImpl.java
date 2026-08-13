package com.sizzle.backend.service.impl;

import com.sizzle.backend.dto.InventoryItemRequest;
import com.sizzle.backend.dto.InventoryItemResponse;
import com.sizzle.backend.dto.RestockRequest;
import com.sizzle.backend.exception.ResourceNotFoundException;
import com.sizzle.backend.model.InventoryItem;
import com.sizzle.backend.model.StockStatus;
import com.sizzle.backend.repository.InventoryRepository;
import com.sizzle.backend.service.InventoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryServiceImpl(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemResponse> getAllInventoryItems(String category, StockStatus status, String search) {
        List<InventoryItem> items = inventoryRepository.findAll();

        return items.stream()
                .filter(item -> category == null || category.equalsIgnoreCase("ALL") || item.getCategory().equalsIgnoreCase(category))
                .filter(item -> status == null || item.getStatus() == status)
                .filter(item -> search == null || search.isBlank() || item.getName().toLowerCase().contains(search.toLowerCase()))
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryItemResponse getInventoryItemById(Long id) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + id));
        return mapToResponse(item);
    }

    @Override
    @Transactional
    public InventoryItemResponse createInventoryItem(InventoryItemRequest request) {
        InventoryItem item = InventoryItem.builder()
                .name(request.getName())
                .category(request.getCategory())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .minThreshold(request.getMinThreshold())
                .costPerUnit(request.getCostPerUnit())
                .supplier(request.getSupplier())
                .lastRestockedAt(LocalDateTime.now())
                .build();

        InventoryItem saved = inventoryRepository.save(item);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public InventoryItemResponse updateInventoryItem(Long id, InventoryItemRequest request) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + id));

        item.setName(request.getName());
        item.setCategory(request.getCategory());
        item.setQuantity(request.getQuantity());
        item.setUnit(request.getUnit());
        item.setMinThreshold(request.getMinThreshold());
        item.setCostPerUnit(request.getCostPerUnit());
        item.setSupplier(request.getSupplier());

        InventoryItem updated = inventoryRepository.save(item);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public InventoryItemResponse restockInventoryItem(Long id, RestockRequest request) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + id));

        Double newQuantity = item.getQuantity() + request.getAddQuantity();
        item.setQuantity(newQuantity);
        item.setLastRestockedAt(LocalDateTime.now());

        InventoryItem updated = inventoryRepository.save(item);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteInventoryItem(Long id) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + id));
        inventoryRepository.delete(item);
    }

    private InventoryItemResponse mapToResponse(InventoryItem item) {
        BigDecimal totalValue = BigDecimal.ZERO;
        if (item.getCostPerUnit() != null && item.getQuantity() != null) {
            totalValue = item.getCostPerUnit().multiply(BigDecimal.valueOf(item.getQuantity())).setScale(2, RoundingMode.HALF_UP);
        }

        return new InventoryItemResponse(
                item.getId(),
                item.getName(),
                item.getCategory(),
                item.getQuantity(),
                item.getUnit(),
                item.getMinThreshold(),
                item.getCostPerUnit(),
                totalValue,
                item.getSupplier(),
                item.getStatus(),
                item.getLastRestockedAt(),
                item.getCreatedAt(),
                item.getUpdatedAt()
        );
    }
}
