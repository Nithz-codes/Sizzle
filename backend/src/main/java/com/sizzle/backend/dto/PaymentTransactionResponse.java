package com.sizzle.backend.dto;

import com.sizzle.backend.model.GatewayProvider;
import com.sizzle.backend.model.PaymentMethod;
import com.sizzle.backend.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentTransactionResponse {
    private Long id;
    private String transactionId;
    private String gatewayOrderId;
    private Long orderId;
    private String orderNumber;
    private BigDecimal amount;
    private String currency;
    private PaymentMethod paymentMethod;
    private GatewayProvider gatewayProvider;
    private PaymentStatus paymentStatus;
    private String cardLastFour;
    private String upiId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PaymentTransactionResponse() {}

    public PaymentTransactionResponse(Long id, String transactionId, String gatewayOrderId, Long orderId, String orderNumber, BigDecimal amount, String currency, PaymentMethod paymentMethod, GatewayProvider gatewayProvider, PaymentStatus paymentStatus, String cardLastFour, String upiId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.transactionId = transactionId;
        this.gatewayOrderId = gatewayOrderId;
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.amount = amount;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
        this.gatewayProvider = gatewayProvider;
        this.paymentStatus = paymentStatus;
        this.cardLastFour = cardLastFour;
        this.upiId = upiId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getCardLastFour() { return cardLastFour; }
    public void setCardLastFour(String cardLastFour) { this.cardLastFour = cardLastFour; }

    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
