package com.sizzle.backend.dto;

import java.math.BigDecimal;

public class OptimizedBasketItem {

    private Long menuItemId;
    private String name;
    private String category;
    private String image;
    private Boolean isVeg;
    private Integer spicyLevel;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal lineTotal;
    private String reason;

    public OptimizedBasketItem() {}

    public OptimizedBasketItem(Long menuItemId, String name, String category, String image,
                               Boolean isVeg, Integer spicyLevel, BigDecimal price,
                               Integer quantity, BigDecimal lineTotal, String reason) {
        this.menuItemId = menuItemId;
        this.name = name;
        this.category = category;
        this.image = image;
        this.isVeg = isVeg;
        this.spicyLevel = spicyLevel;
        this.price = price;
        this.quantity = quantity;
        this.lineTotal = lineTotal;
        this.reason = reason;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Long getMenuItemId() { return menuItemId; }
    public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Boolean getIsVeg() { return isVeg; }
    public void setIsVeg(Boolean isVeg) { this.isVeg = isVeg; }

    public Integer getSpicyLevel() { return spicyLevel; }
    public void setSpicyLevel(Integer spicyLevel) { this.spicyLevel = spicyLevel; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getLineTotal() { return lineTotal; }
    public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public static class Builder {
        private Long menuItemId;
        private String name;
        private String category;
        private String image;
        private Boolean isVeg;
        private Integer spicyLevel;
        private BigDecimal price;
        private Integer quantity;
        private BigDecimal lineTotal;
        private String reason;

        public Builder menuItemId(Long menuItemId) { this.menuItemId = menuItemId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder image(String image) { this.image = image; return this; }
        public Builder isVeg(Boolean isVeg) { this.isVeg = isVeg; return this; }
        public Builder spicyLevel(Integer spicyLevel) { this.spicyLevel = spicyLevel; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public Builder lineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }

        public OptimizedBasketItem build() {
            return new OptimizedBasketItem(menuItemId, name, category, image, isVeg, spicyLevel,
                    price, quantity, lineTotal, reason);
        }
    }
}
