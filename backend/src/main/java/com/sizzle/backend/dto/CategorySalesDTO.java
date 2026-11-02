package com.sizzle.backend.dto;

import java.math.BigDecimal;

public class CategorySalesDTO {
    private String categoryName;
    private long itemsSold;
    private BigDecimal totalRevenue = BigDecimal.ZERO;
    private double quantityShare;
    private double revenueShare;
    private double percentageShare; // Backwards-compatible alias for revenueShare

    public CategorySalesDTO() {}

    public CategorySalesDTO(String categoryName, long itemsSold, BigDecimal totalRevenue, double revenueShare) {
        this.categoryName = categoryName;
        this.itemsSold = itemsSold;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        this.revenueShare = revenueShare;
        this.percentageShare = revenueShare;
    }

    public CategorySalesDTO(String categoryName, long itemsSold, BigDecimal totalRevenue, double quantityShare, double revenueShare) {
        this.categoryName = categoryName;
        this.itemsSold = itemsSold;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        this.quantityShare = quantityShare;
        this.revenueShare = revenueShare;
        this.percentageShare = revenueShare;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public long getItemsSold() {
        return itemsSold;
    }

    public void setItemsSold(long itemsSold) {
        this.itemsSold = itemsSold;
    }

    public long getQuantitySold() {
        return itemsSold;
    }

    public void setQuantitySold(long quantitySold) {
        this.itemsSold = quantitySold;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
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
        this.percentageShare = revenueShare;
    }

    public double getPercentageShare() {
        return percentageShare > 0 ? percentageShare : revenueShare;
    }

    public void setPercentageShare(double percentageShare) {
        this.percentageShare = percentageShare;
        if (this.revenueShare == 0) {
            this.revenueShare = percentageShare;
        }
    }
}
