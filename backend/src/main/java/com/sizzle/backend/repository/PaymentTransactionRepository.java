package com.sizzle.backend.repository;

import com.sizzle.backend.model.PaymentTransaction;
import com.sizzle.backend.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByTransactionId(String transactionId);
    Optional<PaymentTransaction> findByGatewayOrderId(String gatewayOrderId);
    List<PaymentTransaction> findByOrderId(Long orderId);
    List<PaymentTransaction> findByPaymentStatus(PaymentStatus paymentStatus);
}
