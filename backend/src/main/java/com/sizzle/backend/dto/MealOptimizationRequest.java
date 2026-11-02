package com.sizzle.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class MealOptimizationRequest {

    @Min(value = 1, message = "People count must be at least 1")
    @Max(value = 20, message = "People count cannot exceed 20")
    private Integer peopleCount = 2;

    @NotNull(message = "Maximum budget is required")
    @DecimalMin(value = "50.0", message = "Budget must be at least ₹50")
    private BigDecimal maxBudget;

    /**
     * "ANY", "VEG_ONLY", "NON_VEG", "MIXED_ONE_VEG"
     */
    private String dietaryPreference = "ANY";

    /**
     * "ANY", "MILD", "MEDIUM", "SPICY"
     */
    private String spicyPreference = "ANY";

    private List<String> preferredCategories;

    private Integer maxPrepTimeMinutes;

    private String freeTextRequest;

    public MealOptimizationRequest() {}

    public MealOptimizationRequest(Integer peopleCount, BigDecimal maxBudget, String dietaryPreference,
                                   String spicyPreference, List<String> preferredCategories,
                                   Integer maxPrepTimeMinutes, String freeTextRequest) {
        this.peopleCount = (peopleCount != null) ? peopleCount : 2;
        this.maxBudget = maxBudget;
        this.dietaryPreference = (dietaryPreference != null) ? dietaryPreference : "ANY";
        this.spicyPreference = (spicyPreference != null) ? spicyPreference : "ANY";
        this.preferredCategories = preferredCategories;
        this.maxPrepTimeMinutes = maxPrepTimeMinutes;
        this.freeTextRequest = freeTextRequest;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Integer getPeopleCount() { return peopleCount; }
    public void setPeopleCount(Integer peopleCount) { this.peopleCount = peopleCount; }

    public BigDecimal getMaxBudget() { return maxBudget; }
    public void setMaxBudget(BigDecimal maxBudget) { this.maxBudget = maxBudget; }

    public String getDietaryPreference() { return dietaryPreference; }
    public void setDietaryPreference(String dietaryPreference) { this.dietaryPreference = dietaryPreference; }

    public String getSpicyPreference() { return spicyPreference; }
    public void setSpicyPreference(String spicyPreference) { this.spicyPreference = spicyPreference; }

    public List<String> getPreferredCategories() { return preferredCategories; }
    public void setPreferredCategories(List<String> preferredCategories) { this.preferredCategories = preferredCategories; }

    public Integer getMaxPrepTimeMinutes() { return maxPrepTimeMinutes; }
    public void setMaxPrepTimeMinutes(Integer maxPrepTimeMinutes) { this.maxPrepTimeMinutes = maxPrepTimeMinutes; }

    public String getFreeTextRequest() { return freeTextRequest; }
    public void setFreeTextRequest(String freeTextRequest) { this.freeTextRequest = freeTextRequest; }

    public static class Builder {
        private Integer peopleCount = 2;
        private BigDecimal maxBudget;
        private String dietaryPreference = "ANY";
        private String spicyPreference = "ANY";
        private List<String> preferredCategories;
        private Integer maxPrepTimeMinutes;
        private String freeTextRequest;

        public Builder peopleCount(Integer peopleCount) { this.peopleCount = peopleCount; return this; }
        public Builder maxBudget(BigDecimal maxBudget) { this.maxBudget = maxBudget; return this; }
        public Builder dietaryPreference(String dietaryPreference) { this.dietaryPreference = dietaryPreference; return this; }
        public Builder spicyPreference(String spicyPreference) { this.spicyPreference = spicyPreference; return this; }
        public Builder preferredCategories(List<String> preferredCategories) { this.preferredCategories = preferredCategories; return this; }
        public Builder maxPrepTimeMinutes(Integer maxPrepTimeMinutes) { this.maxPrepTimeMinutes = maxPrepTimeMinutes; return this; }
        public Builder freeTextRequest(String freeTextRequest) { this.freeTextRequest = freeTextRequest; return this; }

        public MealOptimizationRequest build() {
            return new MealOptimizationRequest(peopleCount, maxBudget, dietaryPreference, spicyPreference,
                    preferredCategories, maxPrepTimeMinutes, freeTextRequest);
        }
    }
}
