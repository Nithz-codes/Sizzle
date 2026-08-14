package com.sizzle.backend.dto;

import java.math.BigDecimal;

public class TopDishDTO {
    private Long menuItemId;
    private String dishName;
    private String categoryName;
    private long quantitySold;
    private BigDecimal totalRevenue;
    private String imageUrl;

    public TopDishDTO() {}

    public TopDishDTO(Long menuItemId, String dishName, String categoryName, long quantitySold, BigDecimal totalRevenue, String imageUrl) {
        this.menuItemId = menuItemId;
        this.dishName = dishName;
        this.categoryName = categoryName;
        this.quantitySold = quantitySold;
        this.totalRevenue = totalRevenue;
        this.imageUrl = imageUrl;
    }

    public Long getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(Long menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getDishName() {
        return dishName;
    }

    public void setDishName(String dishName) {
        this.dishName = dishName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public long getQuantitySold() {
        return quantitySold;
    }

    public void setQuantitySold(long quantitySold) {
        this.quantitySold = quantitySold;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
