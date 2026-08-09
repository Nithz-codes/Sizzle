package com.sizzle.backend.service;

import com.sizzle.backend.dto.CreateOrderRequest;
import com.sizzle.backend.dto.OrderResponse;
import com.sizzle.backend.dto.UpdateOrderStatusRequest;
import com.sizzle.backend.model.OrderStatus;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(CreateOrderRequest request, String userEmail);
    List<OrderResponse> getUserOrders(String userEmail);
    OrderResponse getOrderByIdOrNumber(String identifier);
    List<OrderResponse> getAllOrders(OrderStatus status);
    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);
}
