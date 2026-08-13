package com.sizzle.backend.controller;

import com.sizzle.backend.dto.*;
import com.sizzle.backend.model.PaymentStatus;
import com.sizzle.backend.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<InitiatePaymentResponse>> initiatePayment(@Valid @RequestBody InitiatePaymentRequest request) {
        InitiatePaymentResponse response = paymentService.initiatePayment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment initiated successfully", response));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<PaymentTransactionResponse>> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        PaymentTransactionResponse response = paymentService.verifyPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified and order settled successfully", response));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<PaymentTransactionResponse>>> getPaymentsByOrder(@PathVariable Long orderId) {
        List<PaymentTransactionResponse> response = paymentService.getPaymentsByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.success("Payment transactions retrieved", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<PaymentTransactionResponse>>> getAllPayments(@RequestParam(required = false) PaymentStatus status) {
        List<PaymentTransactionResponse> response = paymentService.getAllPayments(status);
        return ResponseEntity.ok(ApiResponse.success("Payment transaction audit log retrieved", response));
    }
}
