package com.sizzle.backend.service.impl;

import com.sizzle.backend.dto.*;
import com.sizzle.backend.model.Order;
import com.sizzle.backend.model.OrderItem;
import com.sizzle.backend.model.OrderStatus;
import com.sizzle.backend.repository.OrderRepository;
import com.sizzle.backend.service.AnalyticsService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final OrderRepository orderRepository;

    public AnalyticsServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public AnalyticsOverviewResponse getOverview() {
        List<Order> allOrders = orderRepository.findAllByOrderByCreatedAtDesc();
        List<Order> validOrders = allOrders.stream()
                .filter(o -> o.getOrderStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());

        BigDecimal totalRevenue = validOrders.stream()
                .map(Order::getGrandTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalOrders = validOrders.size();
        BigDecimal averageOrderValue = totalOrders > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        long pendingOrders = allOrders.stream().filter(o -> o.getOrderStatus() == OrderStatus.PENDING).count();
        long preparingOrders = allOrders.stream().filter(o -> o.getOrderStatus() == OrderStatus.PREPARING).count();
        long completedOrders = allOrders.stream().filter(o -> o.getOrderStatus() == OrderStatus.DELIVERED || o.getOrderStatus() == OrderStatus.READY).count();

        // Group daily trends
        Map<LocalDate, List<Order>> ordersByDate = validOrders.stream()
                .collect(Collectors.groupingBy(o -> o.getCreatedAt() != null ? o.getCreatedAt().toLocalDate() : LocalDate.now()));

        List<DailyRevenueDTO> dailyTrends = new ArrayList<>();
        ordersByDate.forEach((date, dateOrders) -> {
            BigDecimal dayRevenue = dateOrders.stream()
                    .map(Order::getGrandTotal)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            dailyTrends.add(new DailyRevenueDTO(date, dayRevenue, dateOrders.size()));
        });
        dailyTrends.sort(Comparator.comparing(DailyRevenueDTO::getDate));

        return new AnalyticsOverviewResponse(
                totalRevenue,
                totalOrders,
                averageOrderValue,
                pendingOrders,
                preparingOrders,
                completedOrders,
                dailyTrends
        );
    }

    @Override
    public List<TopDishDTO> getTopDishes(int limit) {
        List<Order> validOrders = orderRepository.findAll().stream()
                .filter(o -> o.getOrderStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());

        Map<String, TopDishAccumulator> map = new HashMap<>();

        for (Order order : validOrders) {
            if (order.getItems() == null) continue;
            for (OrderItem item : order.getItems()) {
                String name = item.getItemName() != null ? item.getItemName() : "Menu Dish";
                Long menuItemId = item.getMenuItem() != null ? item.getMenuItem().getId() : 1L;
                String catName = item.getMenuItem() != null && item.getMenuItem().getCategory() != null
                        ? item.getMenuItem().getCategory().getName()
                        : "Main";
                String imageUrl = item.getMenuItem() != null && item.getMenuItem().getImage() != null
                        ? item.getMenuItem().getImage()
                        : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";

                TopDishAccumulator acc = map.computeIfAbsent(name, k -> new TopDishAccumulator(
                        menuItemId,
                        name,
                        catName,
                        imageUrl
                ));
                acc.quantitySold += item.getQuantity();
                BigDecimal itemSubtotal = item.getSubtotal() != null ? item.getSubtotal() : item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                acc.totalRevenue = acc.totalRevenue.add(itemSubtotal);
            }
        }

        return map.values().stream()
                .sorted(Comparator.comparingLong((TopDishAccumulator a) -> a.quantitySold).reversed())
                .limit(limit)
                .map(acc -> new TopDishDTO(acc.menuItemId, acc.dishName, acc.categoryName, acc.quantitySold, acc.totalRevenue, acc.imageUrl))
                .collect(Collectors.toList());
    }

    @Override
    public List<CategorySalesDTO> getCategorySales() {
        List<Order> validOrders = orderRepository.findAll().stream()
                .filter(o -> o.getOrderStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());

        Map<String, CategoryAccumulator> map = new HashMap<>();
        BigDecimal grandTotalRevenue = BigDecimal.ZERO;

        for (Order order : validOrders) {
            if (order.getItems() == null) continue;
            for (OrderItem item : order.getItems()) {
                String catName = item.getMenuItem() != null && item.getMenuItem().getCategory() != null
                        ? item.getMenuItem().getCategory().getName()
                        : "Main";
                CategoryAccumulator acc = map.computeIfAbsent(catName, k -> new CategoryAccumulator(catName));
                acc.itemsSold += item.getQuantity();
                BigDecimal sub = item.getSubtotal() != null ? item.getSubtotal() : item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                acc.totalRevenue = acc.totalRevenue.add(sub);
                grandTotalRevenue = grandTotalRevenue.add(sub);
            }
        }

        final BigDecimal finalGrandTotal = grandTotalRevenue;

        return map.values().stream()
                .map(acc -> {
                    double share = finalGrandTotal.compareTo(BigDecimal.ZERO) > 0
                            ? acc.totalRevenue.multiply(BigDecimal.valueOf(100)).divide(finalGrandTotal, 2, RoundingMode.HALF_UP).doubleValue()
                            : 0.0;
                    return new CategorySalesDTO(acc.categoryName, acc.itemsSold, acc.totalRevenue, share);
                })
                .sorted(Comparator.comparing(CategorySalesDTO::getTotalRevenue).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public List<HourlyDemandDTO> getHourlyDemand() {
        List<Order> validOrders = orderRepository.findAll().stream()
                .filter(o -> o.getOrderStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());

        Map<Integer, HourlyAccumulator> map = new HashMap<>();
        for (int h = 0; h < 24; h++) {
            map.put(h, new HourlyAccumulator(h));
        }

        for (Order order : validOrders) {
            LocalDateTime created = order.getCreatedAt() != null ? order.getCreatedAt() : LocalDateTime.now();
            int hour = created.getHour();
            HourlyAccumulator acc = map.get(hour);
            if (acc != null) {
                acc.orderCount++;
                if (order.getGrandTotal() != null) {
                    acc.totalRevenue = acc.totalRevenue.add(order.getGrandTotal());
                }
            }
        }

        return map.values().stream()
                .sorted(Comparator.comparingInt(HourlyAccumulator::getHour))
                .map(acc -> new HourlyDemandDTO(acc.hour, acc.orderCount, acc.totalRevenue))
                .collect(Collectors.toList());
    }

    private static class TopDishAccumulator {
        Long menuItemId;
        String dishName;
        String categoryName;
        String imageUrl;
        long quantitySold = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;

        TopDishAccumulator(Long menuItemId, String dishName, String categoryName, String imageUrl) {
            this.menuItemId = menuItemId;
            this.dishName = dishName;
            this.categoryName = categoryName;
            this.imageUrl = imageUrl;
        }
    }

    private static class CategoryAccumulator {
        String categoryName;
        long itemsSold = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;

        CategoryAccumulator(String categoryName) {
            this.categoryName = categoryName;
        }
    }

    private static class HourlyAccumulator {
        int hour;
        long orderCount = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;

        HourlyAccumulator(int hour) {
            this.hour = hour;
        }

        public int getHour() {
            return hour;
        }
    }
}
