package com.sizzle.backend.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class HourlyDemandDTO {
    private int hour;
    private long orderCount;
    private BigDecimal totalRevenue = BigDecimal.ZERO;
    private BigDecimal averageOrderValue = BigDecimal.ZERO;
    private double orderShare;

    public HourlyDemandDTO() {}

    public HourlyDemandDTO(int hour, long orderCount, BigDecimal totalRevenue) {
        this.hour = hour;
        this.orderCount = orderCount;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        this.averageOrderValue = orderCount > 0
                ? this.totalRevenue.divide(BigDecimal.valueOf(orderCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
    }

    public HourlyDemandDTO(int hour, long orderCount, BigDecimal totalRevenue, BigDecimal averageOrderValue, double orderShare) {
        this.hour = hour;
        this.orderCount = orderCount;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        this.averageOrderValue = averageOrderValue != null ? averageOrderValue : BigDecimal.ZERO;
        this.orderShare = orderShare;
    }

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }

    public long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(long orderCount) {
        this.orderCount = orderCount;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
    }

    public BigDecimal getAverageOrderValue() {
        return averageOrderValue;
    }

    public void setAverageOrderValue(BigDecimal averageOrderValue) {
        this.averageOrderValue = averageOrderValue != null ? averageOrderValue : BigDecimal.ZERO;
    }

    public double getOrderShare() {
        return orderShare;
    }

    public void setOrderShare(double orderShare) {
        this.orderShare = orderShare;
    }
}
