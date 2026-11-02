package com.sizzle.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class RestaurantPulseResponse {

    private String period; // "today", "7days", "30days"
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private BigDecimal averageOrderValue;
    private String topItem;
    private Long topItemQuantity;
    private String leastPerformingItem;
    private String peakHour;
    private String slowHour;
    private Integer lowStockItemsCount;
    private String summary;
    private List<PulseInsight> insights = new ArrayList<>();
    private List<String> recommendations = new ArrayList<>();
    private String source; // "AI" or "DETERMINISTIC_FALLBACK"
    private LocalDateTime generatedAt = LocalDateTime.now();

    public RestaurantPulseResponse() {}

    public RestaurantPulseResponse(String period, BigDecimal totalRevenue, Long totalOrders,
                                   BigDecimal averageOrderValue, String topItem, Long topItemQuantity,
                                   String leastPerformingItem, String peakHour, String slowHour,
                                   Integer lowStockItemsCount, String summary,
                                   List<PulseInsight> insights, List<String> recommendations,
                                   String source) {
        this.period = period;
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders;
        this.averageOrderValue = averageOrderValue;
        this.topItem = topItem;
        this.topItemQuantity = topItemQuantity;
        this.leastPerformingItem = leastPerformingItem;
        this.peakHour = peakHour;
        this.slowHour = slowHour;
        this.lowStockItemsCount = lowStockItemsCount;
        this.summary = summary;
        this.insights = (insights != null) ? insights : new ArrayList<>();
        this.recommendations = (recommendations != null) ? recommendations : new ArrayList<>();
        this.source = source;
        this.generatedAt = LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getAverageOrderValue() { return averageOrderValue; }
    public void setAverageOrderValue(BigDecimal averageOrderValue) { this.averageOrderValue = averageOrderValue; }

    public String getTopItem() { return topItem; }
    public void setTopItem(String topItem) { this.topItem = topItem; }

    public Long getTopItemQuantity() { return topItemQuantity; }
    public void setTopItemQuantity(Long topItemQuantity) { this.topItemQuantity = topItemQuantity; }

    public String getLeastPerformingItem() { return leastPerformingItem; }
    public void setLeastPerformingItem(String leastPerformingItem) { this.leastPerformingItem = leastPerformingItem; }

    public String getPeakHour() { return peakHour; }
    public void setPeakHour(String peakHour) { this.peakHour = peakHour; }

    public String getSlowHour() { return slowHour; }
    public void setSlowHour(String slowHour) { this.slowHour = slowHour; }

    public Integer getLowStockItemsCount() { return lowStockItemsCount; }
    public void setLowStockItemsCount(Integer lowStockItemsCount) { this.lowStockItemsCount = lowStockItemsCount; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<PulseInsight> getInsights() { return insights; }
    public void setInsights(List<PulseInsight> insights) { this.insights = insights; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }

    public static class Builder {
        private String period;
        private BigDecimal totalRevenue;
        private Long totalOrders;
        private BigDecimal averageOrderValue;
        private String topItem;
        private Long topItemQuantity;
        private String leastPerformingItem;
        private String peakHour;
        private String slowHour;
        private Integer lowStockItemsCount;
        private String summary;
        private List<PulseInsight> insights = new ArrayList<>();
        private List<String> recommendations = new ArrayList<>();
        private String source;

        public Builder period(String period) { this.period = period; return this; }
        public Builder totalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; return this; }
        public Builder totalOrders(Long totalOrders) { this.totalOrders = totalOrders; return this; }
        public Builder averageOrderValue(BigDecimal averageOrderValue) { this.averageOrderValue = averageOrderValue; return this; }
        public Builder topItem(String topItem) { this.topItem = topItem; return this; }
        public Builder topItemQuantity(Long topItemQuantity) { this.topItemQuantity = topItemQuantity; return this; }
        public Builder leastPerformingItem(String leastPerformingItem) { this.leastPerformingItem = leastPerformingItem; return this; }
        public Builder peakHour(String peakHour) { this.peakHour = peakHour; return this; }
        public Builder slowHour(String slowHour) { this.slowHour = slowHour; return this; }
        public Builder lowStockItemsCount(Integer lowStockItemsCount) { this.lowStockItemsCount = lowStockItemsCount; return this; }
        public Builder summary(String summary) { this.summary = summary; return this; }
        public Builder insights(List<PulseInsight> insights) { this.insights = insights; return this; }
        public Builder recommendations(List<String> recommendations) { this.recommendations = recommendations; return this; }
        public Builder source(String source) { this.source = source; return this; }

        public RestaurantPulseResponse build() {
            return new RestaurantPulseResponse(period, totalRevenue, totalOrders, averageOrderValue,
                    topItem, topItemQuantity, leastPerformingItem, peakHour, slowHour,
                    lowStockItemsCount, summary, insights, recommendations, source);
        }
    }
}

