package com.sizzle.backend.dto;

import com.sizzle.backend.model.GatewayProvider;
import com.sizzle.backend.model.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public class InitiatePaymentRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private GatewayProvider gatewayProvider = GatewayProvider.RAZORPAY;

    private String cardLastFour;
    private String upiId;

    public InitiatePaymentRequest() {}

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public GatewayProvider getGatewayProvider() { return gatewayProvider; }
    public void setGatewayProvider(GatewayProvider gatewayProvider) { this.gatewayProvider = gatewayProvider; }

    public String getCardLastFour() { return cardLastFour; }
    public void setCardLastFour(String cardLastFour) { this.cardLastFour = cardLastFour; }

    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }
}
