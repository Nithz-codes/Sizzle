package com.sizzle.backend.repository;

import com.sizzle.backend.model.InventoryItem;
import com.sizzle.backend.model.StockStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByStatus(StockStatus status);
    List<InventoryItem> findByCategory(String category);
    List<InventoryItem> findByNameContainingIgnoreCase(String keyword);
    boolean existsByName(String name);
}
