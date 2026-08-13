package com.sizzle.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class VerifyPaymentRequest {

    @NotBlank(message = "Transaction ID is required")
    private String transactionId;

    private String gatewayPaymentId;
    private String gatewaySignature;

    public VerifyPaymentRequest() {}

    public VerifyPaymentRequest(String transactionId, String gatewayPaymentId, String gatewaySignature) {
        this.transactionId = transactionId;
        this.gatewayPaymentId = gatewayPaymentId;
        this.gatewaySignature = gatewaySignature;
    }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getGatewayPaymentId() { return gatewayPaymentId; }
    public void setGatewayPaymentId(String gatewayPaymentId) { this.gatewayPaymentId = gatewayPaymentId; }

    public String getGatewaySignature() { return gatewaySignature; }
    public void setGatewaySignature(String gatewaySignature) { this.gatewaySignature = gatewaySignature; }
}
