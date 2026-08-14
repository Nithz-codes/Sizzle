package com.sizzle.backend.dto;

import java.math.BigDecimal;

public class CategorySalesDTO {
    private String categoryName;
    private long itemsSold;
    private BigDecimal totalRevenue;
    private double percentageShare;

    public CategorySalesDTO() {}

    public CategorySalesDTO(String categoryName, long itemsSold, BigDecimal totalRevenue, double percentageShare) {
        this.categoryName = categoryName;
        this.itemsSold = itemsSold;
        this.totalRevenue = totalRevenue;
        this.percentageShare = percentageShare;
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

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public double getPercentageShare() {
        return percentageShare;
    }

    public void setPercentageShare(double percentageShare) {
        this.percentageShare = percentageShare;
    }
}
