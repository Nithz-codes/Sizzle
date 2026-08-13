package com.sizzle.backend.service;

import com.sizzle.backend.dto.InitiatePaymentRequest;
import com.sizzle.backend.dto.InitiatePaymentResponse;
import com.sizzle.backend.dto.PaymentTransactionResponse;
import com.sizzle.backend.dto.VerifyPaymentRequest;
import com.sizzle.backend.model.PaymentStatus;

import java.util.List;

public interface PaymentService {
    InitiatePaymentResponse initiatePayment(InitiatePaymentRequest request);
    PaymentTransactionResponse verifyPayment(VerifyPaymentRequest request);
    List<PaymentTransactionResponse> getPaymentsByOrderId(Long orderId);
    List<PaymentTransactionResponse> getAllPayments(PaymentStatus status);
}
