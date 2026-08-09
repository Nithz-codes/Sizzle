package com.sizzle.backend.controller;

import com.sizzle.backend.dto.ApiResponse;
import com.sizzle.backend.dto.CreateOrderRequest;
import com.sizzle.backend.dto.OrderResponse;
import com.sizzle.backend.dto.UpdateOrderStatusRequest;
import com.sizzle.backend.model.OrderStatus;
import com.sizzle.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateOrderRequest request) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        OrderResponse response = orderService.createOrder(request, email);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully", response));
    }

    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getUserOrders(@AuthenticationPrincipal UserDetails userDetails) {
        List<OrderResponse> orders = orderService.getUserOrders(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User orders retrieved successfully", orders));
    }

    @GetMapping("/{identifier}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByIdOrNumber(@PathVariable String identifier) {
        OrderResponse response = orderService.getOrderByIdOrNumber(identifier);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CHEF', 'MANAGER', 'WAITER')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders(@RequestParam(required = false) OrderStatus status) {
        List<OrderResponse> orders = orderService.getAllOrders(status);
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'CHEF', 'MANAGER', 'WAITER')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse response = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", response));
    }
}
