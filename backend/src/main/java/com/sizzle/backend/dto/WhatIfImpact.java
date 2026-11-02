package com.sizzle.backend.dto;

public class WhatIfImpact {

    private String revenue;
    private String orders;
    private String risk;

    public WhatIfImpact() {}

    public WhatIfImpact(String revenue, String orders, String risk) {
        this.revenue = revenue;
        this.orders = orders;
        this.risk = risk;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getRevenue() { return revenue; }
    public void setRevenue(String revenue) { this.revenue = revenue; }

    public String getOrders() { return orders; }
    public void setOrders(String orders) { this.orders = orders; }

    public String getRisk() { return risk; }
    public void setRisk(String risk) { this.risk = risk; }

    public static class Builder {
        private String revenue;
        private String orders;
        private String risk;

        public Builder revenue(String revenue) { this.revenue = revenue; return this; }
        public Builder orders(String orders) { this.orders = orders; return this; }
        public Builder risk(String risk) { this.risk = risk; return this; }

        public WhatIfImpact build() {
            return new WhatIfImpact(revenue, orders, risk);
        }
    }
}

