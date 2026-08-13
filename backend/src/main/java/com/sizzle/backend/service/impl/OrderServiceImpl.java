package com.sizzle.backend.service.impl;

import com.sizzle.backend.dto.*;
import com.sizzle.backend.exception.ResourceNotFoundException;
import com.sizzle.backend.model.*;
import com.sizzle.backend.repository.*;
import com.sizzle.backend.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            MenuItemRepository menuItemRepository,
                            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, String userEmail) {
        User user = null;
        if (userEmail != null && !userEmail.isBlank()) {
            user = userRepository.findByEmail(userEmail).orElse(null);
        }

        String orderNumber = generateUniqueOrderNumber();
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .customerName(request.getCustomerName())
                .customerPhone(request.getPhoneNumber())
                .tableNumber(request.getTableNumber())
                .orderType(request.getOrderType() != null ? request.getOrderType() : OrderType.DINE_IN)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.CASH)
                .orderStatus(OrderStatus.PENDING)
                .orderNotes(request.getOrderNotes())
                .subtotal(BigDecimal.ZERO)
                .taxAmount(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .grandTotal(BigDecimal.ZERO)
                .build();

        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + itemReq.getMenuItemId()));

            BigDecimal itemPrice = menuItem.getPrice();
            BigDecimal itemSubtotal = itemPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .itemName(menuItem.getName())
                    .price(itemPrice)
                    .quantity(itemReq.getQuantity())
                    .subtotal(itemSubtotal)
                    .build();

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setSubtotal(subtotal);

        // Calculate 5% GST
        BigDecimal taxAmount = subtotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
        order.setTaxAmount(taxAmount);

        // Calculate 10% discount if subtotal >= 1000
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (subtotal.compareTo(new BigDecimal("1000")) >= 0) {
            discountAmount = subtotal.multiply(new BigDecimal("0.10")).setScale(2, RoundingMode.HALF_UP);
        }
        order.setDiscountAmount(discountAmount);

        BigDecimal grandTotal = subtotal.add(taxAmount).subtract(discountAmount).setScale(2, RoundingMode.HALF_UP);
        order.setGrandTotal(grandTotal);

        Order savedOrder = orderRepository.save(order);
        return mapToOrderResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByIdOrNumber(String identifier) {
        Order order;
        try {
            Long id = Long.parseLong(identifier);
            order = orderRepository.findById(id)
                    .orElseGet(() -> orderRepository.findByOrderNumber(identifier)
                            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + identifier)));
        } catch (NumberFormatException ex) {
            order = orderRepository.findByOrderNumber(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + identifier));
        }
        return mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders(OrderStatus status) {
        List<Order> orders;
        if (status != null) {
            orders = orderRepository.findByOrderStatusOrderByCreatedAtAsc(status);
        } else {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        }
        return orders.stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setOrderStatus(request.getOrderStatus());
        Order updatedOrder = orderRepository.save(order);
        return mapToOrderResponse(updatedOrder);
    }

    private String generateUniqueOrderNumber() {
        Random random = new Random();
        int num = 1000 + random.nextInt(9000);
        return "SZ-" + num;
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(i -> new OrderItemResponse(
                        i.getId(),
                        i.getMenuItem().getId(),
                        i.getItemName(),
                        i.getPrice(),
                        i.getQuantity(),
                        i.getSubtotal()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getUser() != null ? order.getUser().getId() : null,
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getTableNumber(),
                order.getOrderType(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getOrderStatus(),
                order.getSubtotal(),
                order.getTaxAmount(),
                order.getDiscountAmount(),
                order.getGrandTotal(),
                order.getOrderNotes(),
                itemResponses,
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}
