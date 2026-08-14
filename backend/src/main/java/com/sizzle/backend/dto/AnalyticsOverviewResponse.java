package com.sizzle.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class AnalyticsOverviewResponse {
    private BigDecimal totalRevenue;
    private long totalOrders;
    private BigDecimal averageOrderValue;
    private long pendingOrders;
    private long preparingOrders;
    private long completedOrders;
    private List<DailyRevenueDTO> dailyTrends;

    public AnalyticsOverviewResponse() {}

    public AnalyticsOverviewResponse(BigDecimal totalRevenue, long totalOrders, BigDecimal averageOrderValue, long pendingOrders, long preparingOrders, long completedOrders, List<DailyRevenueDTO> dailyTrends) {
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders;
        this.averageOrderValue = averageOrderValue;
        this.pendingOrders = pendingOrders;
        this.preparingOrders = preparingOrders;
        this.completedOrders = completedOrders;
        this.dailyTrends = dailyTrends;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getAverageOrderValue() {
        return averageOrderValue;
    }

    public void setAverageOrderValue(BigDecimal averageOrderValue) {
        this.averageOrderValue = averageOrderValue;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getPreparingOrders() {
        return preparingOrders;
    }

    public void setPreparingOrders(long preparingOrders) {
        this.preparingOrders = preparingOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public List<DailyRevenueDTO> getDailyTrends() {
        return dailyTrends;
    }

    public void setDailyTrends(List<DailyRevenueDTO> dailyTrends) {
        this.dailyTrends = dailyTrends;
    }
}
