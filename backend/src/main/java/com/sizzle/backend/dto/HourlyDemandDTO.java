package com.sizzle.backend.dto;

import java.math.BigDecimal;

public class HourlyDemandDTO {
    private int hour;
    private long orderCount;
    private BigDecimal totalRevenue;

    public HourlyDemandDTO() {}

    public HourlyDemandDTO(int hour, long orderCount, BigDecimal totalRevenue) {
        this.hour = hour;
        this.orderCount = orderCount;
        this.totalRevenue = totalRevenue;
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
        this.totalRevenue = totalRevenue;
    }
}
