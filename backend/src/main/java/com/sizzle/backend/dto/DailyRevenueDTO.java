package com.sizzle.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DailyRevenueDTO {
    private LocalDate date;
    private BigDecimal revenue;
    private long orderCount;

    public DailyRevenueDTO() {}

    public DailyRevenueDTO(LocalDate date, BigDecimal revenue, long orderCount) {
        this.date = date;
        this.revenue = revenue;
        this.orderCount = orderCount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(long orderCount) {
        this.orderCount = orderCount;
    }
}
