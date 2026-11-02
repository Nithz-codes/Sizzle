package com.sizzle.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class WhatIfRequest {

    @NotBlank(message = "Query cannot be blank")
    private String query;

    private String menuItemName;
    private Double discountPercentage;
    private Double volumeIncreasePercentage;

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

    public static class Builder {
        private String query;
        private String menuItemName;
        private Double discountPercentage;
        private Double volumeIncreasePercentage;

        public Builder query(String query) { this.query = query; return this; }
        public Builder menuItemName(String menuItemName) { this.menuItemName = menuItemName; return this; }
        public Builder discountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; return this; }
        public Builder volumeIncreasePercentage(Double volumeIncreasePercentage) { this.volumeIncreasePercentage = volumeIncreasePercentage; return this; }

        public WhatIfRequest build() {
            return new WhatIfRequest(query, menuItemName, discountPercentage, volumeIncreasePercentage);
        }
    }
}

