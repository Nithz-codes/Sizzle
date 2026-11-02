package com.sizzle.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class RestaurantPulseResponse {

    private String period; // "today", "7days", "30days", "all", "custom"
    private String startDate;
    private String endDate;
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private BigDecimal averageOrderValue;
    private Integer averagePrepTimeMinutes;
    private String prepTimeSubtitle;
    private String topItem;
    private Long topItemQuantity;
    private String leastPerformingItem;
    private String peakHour;
    private String slowHour;
    private Integer lowStockItemsCount;
    private String summary;
    private List<PulseInsight> insights = new ArrayList<>();
    private List<String> recommendations = new ArrayList<>();
    private String source; // "AI" or "DETERMINISTIC_ANALYTICS"
    private LocalDateTime generatedAt = LocalDateTime.now();

    // Infographic Rich Data Models
    private List<CategorySalesDTO> categoryBreakdown = new ArrayList<>();
    private List<DailyRevenueDTO> revenueTrends = new ArrayList<>();
    private List<HourlyDemandDTO> hourlyDistribution = new ArrayList<>();
    private List<TopDishDTO> topPerformingDishes = new ArrayList<>();
    private List<TopDishDTO> bottomPerformingDishes = new ArrayList<>();

    // Comparison & Operational Telemetry
    private Double revenuePercentageChange;
    private Double ordersPercentageChange;
    private String comparisonPeriodLabel;
    private Long totalQuantitySold;
    private String quantityShareLeader;
    private String revenueShareLeader;

    public RestaurantPulseResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getAverageOrderValue() { return averageOrderValue; }
    public void setAverageOrderValue(BigDecimal averageOrderValue) { this.averageOrderValue = averageOrderValue; }

    public Integer getAveragePrepTimeMinutes() { return averagePrepTimeMinutes; }
    public void setAveragePrepTimeMinutes(Integer averagePrepTimeMinutes) { this.averagePrepTimeMinutes = averagePrepTimeMinutes; }

    public String getPrepTimeSubtitle() { return prepTimeSubtitle; }
    public void setPrepTimeSubtitle(String prepTimeSubtitle) { this.prepTimeSubtitle = prepTimeSubtitle; }

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

    public List<CategorySalesDTO> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(List<CategorySalesDTO> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

    public List<DailyRevenueDTO> getRevenueTrends() { return revenueTrends; }
    public void setRevenueTrends(List<DailyRevenueDTO> revenueTrends) { this.revenueTrends = revenueTrends; }

    public List<HourlyDemandDTO> getHourlyDistribution() { return hourlyDistribution; }
    public void setHourlyDistribution(List<HourlyDemandDTO> hourlyDistribution) { this.hourlyDistribution = hourlyDistribution; }

    public List<TopDishDTO> getTopPerformingDishes() { return topPerformingDishes; }
    public void setTopPerformingDishes(List<TopDishDTO> topPerformingDishes) { this.topPerformingDishes = topPerformingDishes; }

    public List<TopDishDTO> getBottomPerformingDishes() { return bottomPerformingDishes; }
    public void setBottomPerformingDishes(List<TopDishDTO> bottomPerformingDishes) { this.bottomPerformingDishes = bottomPerformingDishes; }

    public Double getRevenuePercentageChange() { return revenuePercentageChange; }
    public void setRevenuePercentageChange(Double revenuePercentageChange) { this.revenuePercentageChange = revenuePercentageChange; }

    public Double getOrdersPercentageChange() { return ordersPercentageChange; }
    public void setOrdersPercentageChange(Double ordersPercentageChange) { this.ordersPercentageChange = ordersPercentageChange; }

    public String getComparisonPeriodLabel() { return comparisonPeriodLabel; }
    public void setComparisonPeriodLabel(String comparisonPeriodLabel) { this.comparisonPeriodLabel = comparisonPeriodLabel; }

    public Long getTotalQuantitySold() { return totalQuantitySold; }
    public void setTotalQuantitySold(Long totalQuantitySold) { this.totalQuantitySold = totalQuantitySold; }

    public String getQuantityShareLeader() { return quantityShareLeader; }
    public void setQuantityShareLeader(String quantityShareLeader) { this.quantityShareLeader = quantityShareLeader; }

    public String getRevenueShareLeader() { return revenueShareLeader; }
    public void setRevenueShareLeader(String revenueShareLeader) { this.revenueShareLeader = revenueShareLeader; }

    public static class Builder {
        private String period;
        private String startDate;
        private String endDate;
        private BigDecimal totalRevenue = BigDecimal.ZERO;
        private Long totalOrders = 0L;
        private BigDecimal averageOrderValue = BigDecimal.ZERO;
        private Integer averagePrepTimeMinutes;
        private String prepTimeSubtitle;
        private String topItem;
        private Long topItemQuantity = 0L;
        private String leastPerformingItem;
        private String peakHour;
        private String slowHour;
        private Integer lowStockItemsCount = 0;
        private String summary;
        private List<PulseInsight> insights = new ArrayList<>();
        private List<String> recommendations = new ArrayList<>();
        private String source = "DETERMINISTIC_ANALYTICS";
        private List<CategorySalesDTO> categoryBreakdown = new ArrayList<>();
        private List<DailyRevenueDTO> revenueTrends = new ArrayList<>();
        private List<HourlyDemandDTO> hourlyDistribution = new ArrayList<>();
        private List<TopDishDTO> topPerformingDishes = new ArrayList<>();
        private List<TopDishDTO> bottomPerformingDishes = new ArrayList<>();
        private Double revenuePercentageChange;
        private Double ordersPercentageChange;
        private String comparisonPeriodLabel;
        private Long totalQuantitySold = 0L;
        private String quantityShareLeader;
        private String revenueShareLeader;

        public Builder period(String period) { this.period = period; return this; }
        public Builder startDate(String startDate) { this.startDate = startDate; return this; }
        public Builder endDate(String endDate) { this.endDate = endDate; return this; }
        public Builder totalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; return this; }
        public Builder totalOrders(Long totalOrders) { this.totalOrders = totalOrders; return this; }
        public Builder averageOrderValue(BigDecimal averageOrderValue) { this.averageOrderValue = averageOrderValue; return this; }
        public Builder averagePrepTimeMinutes(Integer averagePrepTimeMinutes) { this.averagePrepTimeMinutes = averagePrepTimeMinutes; return this; }
        public Builder prepTimeSubtitle(String prepTimeSubtitle) { this.prepTimeSubtitle = prepTimeSubtitle; return this; }
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
        public Builder categoryBreakdown(List<CategorySalesDTO> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; return this; }
        public Builder revenueTrends(List<DailyRevenueDTO> revenueTrends) { this.revenueTrends = revenueTrends; return this; }
        public Builder hourlyDistribution(List<HourlyDemandDTO> hourlyDistribution) { this.hourlyDistribution = hourlyDistribution; return this; }
        public Builder topPerformingDishes(List<TopDishDTO> topPerformingDishes) { this.topPerformingDishes = topPerformingDishes; return this; }
        public Builder bottomPerformingDishes(List<TopDishDTO> bottomPerformingDishes) { this.bottomPerformingDishes = bottomPerformingDishes; return this; }
        public Builder revenuePercentageChange(Double revenuePercentageChange) { this.revenuePercentageChange = revenuePercentageChange; return this; }
        public Builder ordersPercentageChange(Double ordersPercentageChange) { this.ordersPercentageChange = ordersPercentageChange; return this; }
        public Builder comparisonPeriodLabel(String comparisonPeriodLabel) { this.comparisonPeriodLabel = comparisonPeriodLabel; return this; }
        public Builder totalQuantitySold(Long totalQuantitySold) { this.totalQuantitySold = totalQuantitySold; return this; }
        public Builder quantityShareLeader(String quantityShareLeader) { this.quantityShareLeader = quantityShareLeader; return this; }
        public Builder revenueShareLeader(String revenueShareLeader) { this.revenueShareLeader = revenueShareLeader; return this; }

        public RestaurantPulseResponse build() {
            RestaurantPulseResponse r = new RestaurantPulseResponse();
            r.period = this.period;
            r.startDate = this.startDate;
            r.endDate = this.endDate;
            r.totalRevenue = this.totalRevenue;
            r.totalOrders = this.totalOrders;
            r.averageOrderValue = this.averageOrderValue;
            r.averagePrepTimeMinutes = this.averagePrepTimeMinutes;
            r.prepTimeSubtitle = this.prepTimeSubtitle;
            r.topItem = this.topItem;
            r.topItemQuantity = this.topItemQuantity;
            r.leastPerformingItem = this.leastPerformingItem;
            r.peakHour = this.peakHour;
            r.slowHour = this.slowHour;
            r.lowStockItemsCount = this.lowStockItemsCount;
            r.summary = this.summary;
            r.insights = this.insights != null ? this.insights : new ArrayList<>();
            r.recommendations = this.recommendations != null ? this.recommendations : new ArrayList<>();
            r.source = this.source != null ? this.source : "DETERMINISTIC_ANALYTICS";
            r.categoryBreakdown = this.categoryBreakdown != null ? this.categoryBreakdown : new ArrayList<>();
            r.revenueTrends = this.revenueTrends != null ? this.revenueTrends : new ArrayList<>();
            r.hourlyDistribution = this.hourlyDistribution != null ? this.hourlyDistribution : new ArrayList<>();
            r.topPerformingDishes = this.topPerformingDishes != null ? this.topPerformingDishes : new ArrayList<>();
            r.bottomPerformingDishes = this.bottomPerformingDishes != null ? this.bottomPerformingDishes : new ArrayList<>();
            r.revenuePercentageChange = this.revenuePercentageChange;
            r.ordersPercentageChange = this.ordersPercentageChange;
            r.comparisonPeriodLabel = this.comparisonPeriodLabel;
            r.totalQuantitySold = this.totalQuantitySold;
            r.quantityShareLeader = this.quantityShareLeader;
            r.revenueShareLeader = this.revenueShareLeader;
            r.generatedAt = LocalDateTime.now();
            return r;
        }
    }
}
