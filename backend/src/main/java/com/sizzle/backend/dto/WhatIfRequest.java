package com.sizzle.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class WhatIfRequest {

    @NotBlank(message = "Query cannot be blank")
    private String query;

    private String menuItemName;
    private Double discountPercentage;
    private Double volumeIncreasePercentage;
    private String scenarioType;
    private BigDecimal newItemPrice;

    public WhatIfRequest() {}

    public WhatIfRequest(String query) {
        this.query = query;
    }

    public WhatIfRequest(String query, String menuItemName, Double discountPercentage, Double volumeIncreasePercentage) {
        this.query = query;
        this.menuItemName = menuItemName;
        this.discountPercentage = discountPercentage;
        this.volumeIncreasePercentage = volumeIncreasePercentage;
    }

    public WhatIfRequest(String query, String menuItemName, Double discountPercentage, Double volumeIncreasePercentage, String scenarioType, BigDecimal newItemPrice) {
        this.query = query;
        this.menuItemName = menuItemName;
        this.discountPercentage = discountPercentage;
        this.volumeIncreasePercentage = volumeIncreasePercentage;
        this.scenarioType = scenarioType;
        this.newItemPrice = newItemPrice;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getMenuItemName() { return menuItemName; }
    public void setMenuItemName(String menuItemName) { this.menuItemName = menuItemName; }

    public Double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; }

    public Double getVolumeIncreasePercentage() { return volumeIncreasePercentage; }
    public void setVolumeIncreasePercentage(Double volumeIncreasePercentage) { this.volumeIncreasePercentage = volumeIncreasePercentage; }

    public String getScenarioType() { return scenarioType; }
    public void setScenarioType(String scenarioType) { this.scenarioType = scenarioType; }

    public BigDecimal getNewItemPrice() { return newItemPrice; }
    public void setNewItemPrice(BigDecimal newItemPrice) { this.newItemPrice = newItemPrice; }

    public static class Builder {
        private String query;
        private String menuItemName;
        private Double discountPercentage;
        private Double volumeIncreasePercentage;
        private String scenarioType;
        private BigDecimal newItemPrice;

        public Builder query(String query) { this.query = query; return this; }
        public Builder menuItemName(String menuItemName) { this.menuItemName = menuItemName; return this; }
        public Builder discountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; return this; }
        public Builder volumeIncreasePercentage(Double volumeIncreasePercentage) { this.volumeIncreasePercentage = volumeIncreasePercentage; return this; }
        public Builder scenarioType(String scenarioType) { this.scenarioType = scenarioType; return this; }
        public Builder newItemPrice(BigDecimal newItemPrice) { this.newItemPrice = newItemPrice; return this; }

        public WhatIfRequest build() {
            return new WhatIfRequest(query, menuItemName, discountPercentage, volumeIncreasePercentage, scenarioType, newItemPrice);
        }
    }
}
