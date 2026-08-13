package com.sizzle.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(nullable = false)
    private Double minThreshold;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal costPerUnit;

    @Column(length = 150)
    private String supplier;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StockStatus status = StockStatus.IN_STOCK;

    private LocalDateTime lastRestockedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public InventoryItem() {}

    public InventoryItem(Long id, String name, String category, Double quantity, String unit, Double minThreshold, BigDecimal costPerUnit, String supplier, StockStatus status, LocalDateTime lastRestockedAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.unit = unit;
        this.minThreshold = minThreshold;
        this.costPerUnit = costPerUnit;
        this.supplier = supplier;
        this.status = status != null ? status : StockStatus.IN_STOCK;
        this.lastRestockedAt = lastRestockedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        updateCalculatedStatus();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.lastRestockedAt == null) {
            this.lastRestockedAt = LocalDateTime.now();
        }
        updateCalculatedStatus();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        updateCalculatedStatus();
    }

    public void updateCalculatedStatus() {
        if (this.quantity == null || this.quantity <= 0) {
            this.status = StockStatus.OUT_OF_STOCK;
        } else if (this.minThreshold != null && this.quantity <= this.minThreshold) {
            this.status = StockStatus.LOW_STOCK;
        } else {
            this.status = StockStatus.IN_STOCK;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) {
        this.quantity = quantity;
        updateCalculatedStatus();
    }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Double getMinThreshold() { return minThreshold; }
    public void setMinThreshold(Double minThreshold) {
        this.minThreshold = minThreshold;
        updateCalculatedStatus();
    }

    public BigDecimal getCostPerUnit() { return costPerUnit; }
    public void setCostPerUnit(BigDecimal costPerUnit) { this.costPerUnit = costPerUnit; }

    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }

    public StockStatus getStatus() { return status; }
    public void setStatus(StockStatus status) { this.status = status; }

    public LocalDateTime getLastRestockedAt() { return lastRestockedAt; }
    public void setLastRestockedAt(LocalDateTime lastRestockedAt) { this.lastRestockedAt = lastRestockedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static InventoryItemBuilder builder() {
        return new InventoryItemBuilder();
    }

    public static class InventoryItemBuilder {
        private Long id;
        private String name;
        private String category;
        private Double quantity;
        private String unit;
        private Double minThreshold;
        private BigDecimal costPerUnit;
        private String supplier;
        private StockStatus status;
        private LocalDateTime lastRestockedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public InventoryItemBuilder id(Long id) { this.id = id; return this; }
        public InventoryItemBuilder name(String name) { this.name = name; return this; }
        public InventoryItemBuilder category(String category) { this.category = category; return this; }
        public InventoryItemBuilder quantity(Double quantity) { this.quantity = quantity; return this; }
        public InventoryItemBuilder unit(String unit) { this.unit = unit; return this; }
        public InventoryItemBuilder minThreshold(Double minThreshold) { this.minThreshold = minThreshold; return this; }
        public InventoryItemBuilder costPerUnit(BigDecimal costPerUnit) { this.costPerUnit = costPerUnit; return this; }
        public InventoryItemBuilder supplier(String supplier) { this.supplier = supplier; return this; }
        public InventoryItemBuilder status(StockStatus status) { this.status = status; return this; }
        public InventoryItemBuilder lastRestockedAt(LocalDateTime lastRestockedAt) { this.lastRestockedAt = lastRestockedAt; return this; }
        public InventoryItemBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public InventoryItemBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public InventoryItem build() {
            return new InventoryItem(id, name, category, quantity, unit, minThreshold, costPerUnit, supplier, status, lastRestockedAt, createdAt, updatedAt);
        }
    }
}
