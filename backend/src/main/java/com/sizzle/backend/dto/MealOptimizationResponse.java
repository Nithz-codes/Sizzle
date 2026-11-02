package com.sizzle.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class MealOptimizationResponse {

    private List<OptimizedBasketItem> items = new ArrayList<>();
    private BigDecimal totalPrice;
    private BigDecimal maxBudget;
    private BigDecimal budgetRemaining;
    private Integer estimatedPreparationMinutes;
    private Integer peopleCount;
    private String summary;
    private String confidence; // HIGH, MEDIUM, LOW
    private String source; // "AI" or "DETERMINISTIC_FALLBACK"
    private LocalDateTime timestamp = LocalDateTime.now();

    public MealOptimizationResponse() {
    }

    public MealOptimizationResponse(List<OptimizedBasketItem> items, BigDecimal totalPrice,
            BigDecimal maxBudget, BigDecimal budgetRemaining,
            Integer estimatedPreparationMinutes, Integer peopleCount,
            String summary, String confidence, String source) {
        this.items = (items != null) ? items : new ArrayList<>();
        this.totalPrice = totalPrice;
        this.maxBudget = maxBudget;
        this.budgetRemaining = budgetRemaining;
        this.estimatedPreparationMinutes = estimatedPreparationMinutes;
        this.peopleCount = peopleCount;
        this.summary = summary;
        this.confidence = confidence;
        this.source = source;
        this.timestamp = LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public List<OptimizedBasketItem> getItems() {
        return items;
    }

    public void setItems(List<OptimizedBasketItem> items) {
        this.items = items;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public BigDecimal getMaxBudget() {
        return maxBudget;
    }

    public void setMaxBudget(BigDecimal maxBudget) {
        this.maxBudget = maxBudget;
    }

    public BigDecimal getBudgetRemaining() {
        return budgetRemaining;
    }

    public void setBudgetRemaining(BigDecimal budgetRemaining) {
        this.budgetRemaining = budgetRemaining;
    }

    public Integer getEstimatedPreparationMinutes() {
        return estimatedPreparationMinutes;
    }

    public void setEstimatedPreparationMinutes(Integer estimatedPreparationMinutes) {
        this.estimatedPreparationMinutes = estimatedPreparationMinutes;
    }

    public Integer getPeopleCount() {
        return peopleCount;
    }

    public void setPeopleCount(Integer peopleCount) {
        this.peopleCount = peopleCount;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getConfidence() {
        return confidence;
    }

    public void setConfidence(String confidence) {
        this.confidence = confidence;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public static class Builder {
        private List<OptimizedBasketItem> items = new ArrayList<>();
        private BigDecimal totalPrice;
        private BigDecimal maxBudget;
        private BigDecimal budgetRemaining;
        private Integer estimatedPreparationMinutes;
        private Integer peopleCount;
        private String summary;
        private String confidence;
        private String source;

        public Builder items(List<OptimizedBasketItem> items) {
            this.items = items;
            return this;
        }

        public Builder totalPrice(BigDecimal totalPrice) {
            this.totalPrice = totalPrice;
            return this;
        }

        public Builder maxBudget(BigDecimal maxBudget) {
            this.maxBudget = maxBudget;
            return this;
        }

        public Builder budgetRemaining(BigDecimal budgetRemaining) {
            this.budgetRemaining = budgetRemaining;
            return this;
        }

        public Builder estimatedPreparationMinutes(Integer estimatedPreparationMinutes) {
            this.estimatedPreparationMinutes = estimatedPreparationMinutes;
            return this;
        }

        public Builder peopleCount(Integer peopleCount) {
            this.peopleCount = peopleCount;
            return this;
        }

        public Builder summary(String summary) {
            this.summary = summary;
            return this;
        }

        public Builder confidence(String confidence) {
            this.confidence = confidence;
            return this;
        }

        public Builder source(String source) {
            this.source = source;
            return this;
        }

        public MealOptimizationResponse build() {
            return new MealOptimizationResponse(items, totalPrice, maxBudget, budgetRemaining,
                    estimatedPreparationMinutes, peopleCount, summary, confidence, source);
        }
    }
}
