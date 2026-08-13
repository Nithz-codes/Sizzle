package com.sizzle.backend.dto;

import com.sizzle.backend.model.GatewayProvider;
import com.sizzle.backend.model.PaymentMethod;
import java.math.BigDecimal;

public class InitiatePaymentResponse {
    private String transactionId;
    private String gatewayOrderId;
    private Long orderId;
    private String orderNumber;
    private BigDecimal amount;
    private String currency;
    private PaymentMethod paymentMethod;
    private GatewayProvider gatewayProvider;
    private String gatewayKey;
    private String checkoutUrl;

    public InitiatePaymentResponse() {}

    public InitiatePaymentResponse(String transactionId, String gatewayOrderId, Long orderId, String orderNumber, BigDecimal amount, String currency, PaymentMethod paymentMethod, GatewayProvider gatewayProvider, String gatewayKey, String checkoutUrl) {
        this.transactionId = transactionId;
        this.gatewayOrderId = gatewayOrderId;
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.amount = amount;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
        this.gatewayProvider = gatewayProvider;
        this.gatewayKey = gatewayKey;
        this.checkoutUrl = checkoutUrl;
    }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getGatewayOrderId() { return gatewayOrderId; }
    public void setGatewayOrderId(String gatewayOrderId) { this.gatewayOrderId = gatewayOrderId; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public GatewayProvider getGatewayProvider() { return gatewayProvider; }
    public void setGatewayProvider(GatewayProvider gatewayProvider) { this.gatewayProvider = gatewayProvider; }

    public String getGatewayKey() { return gatewayKey; }
    public void setGatewayKey(String gatewayKey) { this.gatewayKey = gatewayKey; }

    public String getCheckoutUrl() { return checkoutUrl; }
    public void setCheckoutUrl(String checkoutUrl) { this.checkoutUrl = checkoutUrl; }
}
