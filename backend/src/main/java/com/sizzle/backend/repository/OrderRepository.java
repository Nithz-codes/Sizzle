package com.sizzle.backend.repository;

import com.sizzle.backend.model.Order;
import com.sizzle.backend.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findByOrderStatusOrderByCreatedAtAsc(OrderStatus orderStatus);
    List<Order> findAllByOrderByCreatedAtDesc();
}
