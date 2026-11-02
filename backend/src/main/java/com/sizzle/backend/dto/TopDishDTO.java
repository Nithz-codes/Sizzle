package com.sizzle.backend.dto;

import java.math.BigDecimal;

public class TopDishDTO {
    private Long menuItemId;
    private String dishName;
    private String categoryName;
    private long quantitySold;
    private BigDecimal totalRevenue = BigDecimal.ZERO;
    private String imageUrl;
    private double quantityShare;
    private double revenueShare;
    private int rank;

    public TopDishDTO() {}

    public TopDishDTO(Long menuItemId, String dishName, String categoryName, long quantitySold, BigDecimal totalRevenue, String imageUrl) {
        this.menuItemId = menuItemId;
        this.dishName = dishName;
        this.categoryName = categoryName;
        this.quantitySold = quantitySold;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        this.imageUrl = imageUrl;
    }

    public TopDishDTO(Long menuItemId, String dishName, String categoryName, long quantitySold, BigDecimal totalRevenue, String imageUrl, double quantityShare, double revenueShare, int rank) {
        this.menuItemId = menuItemId;
        this.dishName = dishName;
        this.categoryName = categoryName;
        this.quantitySold = quantitySold;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        this.imageUrl = imageUrl;
        this.quantityShare = quantityShare;
        this.revenueShare = revenueShare;
        this.rank = rank;
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
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getQuantityShare() {
        return quantityShare;
    }

    public void setQuantityShare(double quantityShare) {
        this.quantityShare = quantityShare;
    }

    public double getRevenueShare() {
        return revenueShare;
    }

    public void setRevenueShare(double revenueShare) {
        this.revenueShare = revenueShare;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }
}
