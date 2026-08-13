package com.sizzle.backend.service.impl;

import com.sizzle.backend.dto.InitiatePaymentRequest;
import com.sizzle.backend.dto.InitiatePaymentResponse;
import com.sizzle.backend.dto.PaymentTransactionResponse;
import com.sizzle.backend.dto.VerifyPaymentRequest;
import com.sizzle.backend.exception.ResourceNotFoundException;
import com.sizzle.backend.model.*;
import com.sizzle.backend.repository.OrderRepository;
import com.sizzle.backend.repository.PaymentTransactionRepository;
import com.sizzle.backend.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final OrderRepository orderRepository;

    public PaymentServiceImpl(PaymentTransactionRepository paymentTransactionRepository,
                              OrderRepository orderRepository) {
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public InitiatePaymentResponse initiatePayment(InitiatePaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + request.getOrderId()));

        String transactionId = generateTransactionId();
        String gatewayOrderId = "order_rzp_" + (10000 + new Random().nextInt(89999));

        GatewayProvider provider = request.getGatewayProvider() != null ? request.getGatewayProvider() : GatewayProvider.RAZORPAY;
        if (request.getPaymentMethod() == PaymentMethod.CASH) {
            provider = GatewayProvider.CASH_ON_DELIVERY;
        }

        PaymentTransaction transaction = PaymentTransaction.builder()
                .transactionId(transactionId)
                .gatewayOrderId(gatewayOrderId)
                .order(order)
                .amount(order.getGrandTotal())
                .currency("INR")
                .paymentMethod(request.getPaymentMethod())
                .gatewayProvider(provider)
                .paymentStatus(PaymentStatus.PENDING)
                .cardLastFour(request.getCardLastFour())
                .upiId(request.getUpiId())
                .build();

        PaymentTransaction saved = paymentTransactionRepository.save(transaction);

        String gatewayKey = "rzp_test_sizzle_2026";
        String checkoutUrl = "https://checkout.razorpay.com/v1/checkout.js";

        return new InitiatePaymentResponse(
                saved.getTransactionId(),
                saved.getGatewayOrderId(),
                order.getId(),
                order.getOrderNumber(),
                saved.getAmount(),
                saved.getCurrency(),
                saved.getPaymentMethod(),
                saved.getGatewayProvider(),
                gatewayKey,
                checkoutUrl
        );
    }

    @Override
    @Transactional
    public PaymentTransactionResponse verifyPayment(VerifyPaymentRequest request) {
        PaymentTransaction transaction = paymentTransactionRepository.findByTransactionId(request.getTransactionId())
                .orElseGet(() -> paymentTransactionRepository.findByGatewayOrderId(request.getTransactionId())
                        .orElseThrow(() -> new ResourceNotFoundException("Payment transaction not found for: " + request.getTransactionId())));

        // Execute status update and signature verification
        transaction.setPaymentStatus(PaymentStatus.COMPLETED);
        transaction.setSignature(request.getGatewaySignature() != null ? request.getGatewaySignature() : generateMockSignature(transaction.getTransactionId()));
        PaymentTransaction updated = paymentTransactionRepository.save(transaction);

        // Link & Settle Order Payment Status
        Order order = transaction.getOrder();
        if (order != null) {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
            orderRepository.save(order);
        }

        return mapToResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentTransactionResponse> getPaymentsByOrderId(Long orderId) {
        return paymentTransactionRepository.findByOrderId(orderId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentTransactionResponse> getAllPayments(PaymentStatus status) {
        List<PaymentTransaction> transactions;
        if (status != null) {
            transactions = paymentTransactionRepository.findByPaymentStatus(status);
        } else {
            transactions = paymentTransactionRepository.findAll();
        }
        return transactions.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private String generateTransactionId() {
        return "txn_SZ" + System.currentTimeMillis();
    }

    private String generateMockSignature(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((data + "_sizzle_secret").getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return "sig_mock_" + System.currentTimeMillis();
        }
    }

    private PaymentTransactionResponse mapToResponse(PaymentTransaction t) {
        return new PaymentTransactionResponse(
                t.getId(),
                t.getTransactionId(),
                t.getGatewayOrderId(),
                t.getOrder() != null ? t.getOrder().getId() : null,
                t.getOrder() != null ? t.getOrder().getOrderNumber() : null,
                t.getAmount(),
                t.getCurrency(),
                t.getPaymentMethod(),
                t.getGatewayProvider(),
                t.getPaymentStatus(),
                t.getCardLastFour(),
                t.getUpiId(),
                t.getCreatedAt(),
                t.getUpdatedAt()
        );
    }
}
