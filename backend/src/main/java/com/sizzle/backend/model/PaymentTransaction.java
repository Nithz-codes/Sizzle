package com.sizzle.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String transactionId;

    @Column(length = 100)
    private String gatewayOrderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentMethod paymentMethod = PaymentMethod.CASH;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private GatewayProvider gatewayProvider = GatewayProvider.RAZORPAY;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(length = 10)
    private String cardLastFour;

    @Column(length = 100)
    private String upiId;

    @Column(length = 255)
    private String signature;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public PaymentTransaction() {}

    public PaymentTransaction(Long id, String transactionId, String gatewayOrderId, Order order, BigDecimal amount, String currency, PaymentMethod paymentMethod, GatewayProvider gatewayProvider, PaymentStatus paymentStatus, String cardLastFour, String upiId, String signature, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.transactionId = transactionId;
        this.gatewayOrderId = gatewayOrderId;
        this.order = order;
        this.amount = amount;
        this.currency = currency != null ? currency : "INR";
        this.paymentMethod = paymentMethod != null ? paymentMethod : PaymentMethod.CASH;
        this.gatewayProvider = gatewayProvider != null ? gatewayProvider : GatewayProvider.RAZORPAY;
        this.paymentStatus = paymentStatus != null ? paymentStatus : PaymentStatus.PENDING;
        this.cardLastFour = cardLastFour;
        this.upiId = upiId;
        this.signature = signature;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.currency == null) this.currency = "INR";
        if (this.paymentStatus == null) this.paymentStatus = PaymentStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getGatewayOrderId() { return gatewayOrderId; }
    public void setGatewayOrderId(String gatewayOrderId) { this.gatewayOrderId = gatewayOrderId; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

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

    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static PaymentTransactionBuilder builder() {
        return new PaymentTransactionBuilder();
    }

    public static class PaymentTransactionBuilder {
        private Long id;
        private String transactionId;
        private String gatewayOrderId;
        private Order order;
        private BigDecimal amount;
        private String currency = "INR";
        private PaymentMethod paymentMethod = PaymentMethod.CASH;
        private GatewayProvider gatewayProvider = GatewayProvider.RAZORPAY;
        private PaymentStatus paymentStatus = PaymentStatus.PENDING;
        private String cardLastFour;
        private String upiId;
        private String signature;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public PaymentTransactionBuilder id(Long id) { this.id = id; return this; }
        public PaymentTransactionBuilder transactionId(String transactionId) { this.transactionId = transactionId; return this; }
        public PaymentTransactionBuilder gatewayOrderId(String gatewayOrderId) { this.gatewayOrderId = gatewayOrderId; return this; }
        public PaymentTransactionBuilder order(Order order) { this.order = order; return this; }
        public PaymentTransactionBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public PaymentTransactionBuilder currency(String currency) { this.currency = currency; return this; }
        public PaymentTransactionBuilder paymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public PaymentTransactionBuilder gatewayProvider(GatewayProvider gatewayProvider) { this.gatewayProvider = gatewayProvider; return this; }
        public PaymentTransactionBuilder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public PaymentTransactionBuilder cardLastFour(String cardLastFour) { this.cardLastFour = cardLastFour; return this; }
        public PaymentTransactionBuilder upiId(String upiId) { this.upiId = upiId; return this; }
        public PaymentTransactionBuilder signature(String signature) { this.signature = signature; return this; }
        public PaymentTransactionBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PaymentTransactionBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public PaymentTransaction build() {
            return new PaymentTransaction(id, transactionId, gatewayOrderId, order, amount, currency, paymentMethod, gatewayProvider, paymentStatus, cardLastFour, upiId, signature, createdAt, updatedAt);
        }
    }
}
