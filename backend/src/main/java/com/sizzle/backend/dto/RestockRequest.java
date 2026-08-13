package com.sizzle.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class RestockRequest {

    @NotNull(message = "Added quantity is required")
    @Min(value = 0, message = "Added quantity must be positive")
    private Double addQuantity;

    public RestockRequest() {}

    public RestockRequest(Double addQuantity) {
        this.addQuantity = addQuantity;
    }

    public Double getAddQuantity() { return addQuantity; }
    public void setAddQuantity(Double addQuantity) { this.addQuantity = addQuantity; }
}
