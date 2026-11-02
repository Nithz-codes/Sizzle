package com.sizzle.backend.dto;

import java.math.BigDecimal;

public class WhatIfState {

    private String label;
    private Long orders;
    private BigDecimal revenue;
    private BigDecimal averagePrice;

    public WhatIfState() {}

    public WhatIfState(String label, Long orders, BigDecimal revenue, BigDecimal averagePrice) {
        this.label = label;
        this.orders = orders;
        this.revenue = revenue;
        this.averagePrice = averagePrice;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public Long getOrders() { return orders; }
    public void setOrders(Long orders) { this.orders = orders; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public BigDecimal getAveragePrice() { return averagePrice; }
    public void setAveragePrice(BigDecimal averagePrice) { this.averagePrice = averagePrice; }

    public static class Builder {
        private String label;
        private Long orders;
        private BigDecimal revenue;
        private BigDecimal averagePrice;

        public Builder label(String label) { this.label = label; return this; }
        public Builder orders(Long orders) { this.orders = orders; return this; }
        public Builder revenue(BigDecimal revenue) { this.revenue = revenue; return this; }
        public Builder averagePrice(BigDecimal averagePrice) { this.averagePrice = averagePrice; return this; }

        public WhatIfState build() {
            return new WhatIfState(label, orders, revenue, averagePrice);
        }
    }
}

