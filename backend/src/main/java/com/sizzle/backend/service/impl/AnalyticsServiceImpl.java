package com.sizzle.backend.service.impl;

import com.sizzle.backend.dto.*;
import com.sizzle.backend.model.MenuItem;
import com.sizzle.backend.model.Order;
import com.sizzle.backend.model.OrderItem;
import com.sizzle.backend.model.OrderStatus;
import com.sizzle.backend.repository.MenuItemRepository;
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
    private final MenuItemRepository menuItemRepository;

    public AnalyticsServiceImpl(OrderRepository orderRepository, MenuItemRepository menuItemRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
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
        long completedOrders = allOrders.stream()
                .filter(o -> o.getOrderStatus() == OrderStatus.DELIVERED || o.getOrderStatus() == OrderStatus.READY)
                .count();

        List<DailyRevenueDTO> dailyTrends = getDailyTrends(validOrders);

        return new AnalyticsOverviewResponse(
                totalRevenue,
                totalOrders,
                averageOrderValue,
                pendingOrders,
                preparingOrders,
                completedOrders,
                dailyTrends);
    }

    @Override
    public List<TopDishDTO> getTopDishes(int limit) {
        List<Order> validOrders = orderRepository.findAll().stream()
                .filter(o -> o.getOrderStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());
        return getTopDishes(validOrders, limit);
    }

    @Override
    public List<TopDishDTO> getTopDishes(List<Order> validOrders, int limit) {
        if (validOrders == null || validOrders.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, TopDishAccumulator> map = new LinkedHashMap<>();
        long grandTotalQuantity = 0;
        BigDecimal grandTotalRevenue = BigDecimal.ZERO;

        for (Order order : validOrders) {
            if (order.getItems() == null)
                continue;
            for (OrderItem item : order.getItems()) {
                String name = item.getItemName() != null ? item.getItemName() : "Menu Dish";
                Long menuItemId = item.getMenuItem() != null ? item.getMenuItem().getId() : 1L;
                String catName = item.getMenuItem() != null && item.getMenuItem().getCategory() != null
                        ? item.getMenuItem().getCategory().getName()
                        : "Main";
                String imageUrl = item.getMenuItem() != null && item.getMenuItem().getImage() != null
                        ? item.getMenuItem().getImage()
                        : "https://images.unsplash.com/photo-1546833719-d2fe7042f651?auto=format&fit=crop&w=800&q=80";

                TopDishAccumulator acc = map.computeIfAbsent(name, k -> new TopDishAccumulator(
                        menuItemId,
                        name,
                        catName,
                        imageUrl));
                long qty = item.getQuantity() != null ? item.getQuantity() : 1;
                acc.quantitySold += qty;
                grandTotalQuantity += qty;

                BigDecimal itemSubtotal = item.getSubtotal() != null
                        ? item.getSubtotal()
                        : (item.getPrice() != null ? item.getPrice().multiply(BigDecimal.valueOf(qty))
                                : BigDecimal.ZERO);
                acc.totalRevenue = acc.totalRevenue.add(itemSubtotal);
                grandTotalRevenue = grandTotalRevenue.add(itemSubtotal);
            }
        }

        final long finalQtyTotal = grandTotalQuantity;
        final BigDecimal finalRevTotal = grandTotalRevenue;

        List<TopDishDTO> sorted = map.values().stream()
                .sorted(Comparator.comparingLong((TopDishAccumulator a) -> a.quantitySold).reversed()
                        .thenComparing(a -> a.totalRevenue, Comparator.reverseOrder()))
                .limit(limit)
                .map(acc -> {
                    double qShare = finalQtyTotal > 0
                            ? BigDecimal.valueOf(acc.quantitySold * 100.0)
                                    .divide(BigDecimal.valueOf(finalQtyTotal), 2, RoundingMode.HALF_UP).doubleValue()
                            : 0.0;
                    double rShare = finalRevTotal.compareTo(BigDecimal.ZERO) > 0
                            ? acc.totalRevenue.multiply(BigDecimal.valueOf(100))
                                    .divide(finalRevTotal, 2, RoundingMode.HALF_UP).doubleValue()
                            : 0.0;
                    return new TopDishDTO(acc.menuItemId, acc.dishName, acc.categoryName, acc.quantitySold,
                            acc.totalRevenue, acc.imageUrl, qShare, rShare, 0);
                })
                .collect(Collectors.toList());

        for (int i = 0; i < sorted.size(); i++) {
            sorted.get(i).setRank(i + 1);
        }

        return sorted;
    }

    @Override
    public List<TopDishDTO> getLowestPerformingDishes(List<Order> validOrders, int limit) {
        List<MenuItem> allMenuItems = menuItemRepository.findByIsAvailableTrue();
        if (allMenuItems.isEmpty()) {
            return Collections.emptyList();
        }

        Map<Long, TopDishAccumulator> salesMap = new HashMap<>();
        long grandTotalQuantity = 0;
        BigDecimal grandTotalRevenue = BigDecimal.ZERO;

        if (validOrders != null) {
            for (Order order : validOrders) {
                if (order.getItems() == null)
                    continue;
                for (OrderItem item : order.getItems()) {
                    Long mId = item.getMenuItem() != null ? item.getMenuItem().getId() : null;
                    if (mId == null)
                        continue;
                    long qty = item.getQuantity() != null ? item.getQuantity() : 1;
                    BigDecimal sub = item.getSubtotal() != null
                            ? item.getSubtotal()
                            : (item.getPrice() != null ? item.getPrice().multiply(BigDecimal.valueOf(qty))
                                    : BigDecimal.ZERO);

                    TopDishAccumulator acc = salesMap.computeIfAbsent(mId, k -> new TopDishAccumulator(
                            mId,
                            item.getItemName() != null ? item.getItemName() : "Menu Dish",
                            item.getMenuItem().getCategory() != null ? item.getMenuItem().getCategory().getName()
                                    : "General",
                            item.getMenuItem().getImage()));
                    acc.quantitySold += qty;
                    acc.totalRevenue = acc.totalRevenue.add(sub);
                    grandTotalQuantity += qty;
                    grandTotalRevenue = grandTotalRevenue.add(sub);
                }
            }
        }

        final long finalQtyTotal = grandTotalQuantity;
        final BigDecimal finalRevTotal = grandTotalRevenue;

        List<TopDishDTO> lowest = allMenuItems.stream()
                .map(m -> {
                    TopDishAccumulator acc = salesMap.get(m.getId());
                    long sold = acc != null ? acc.quantitySold : 0L;
                    BigDecimal rev = acc != null ? acc.totalRevenue : BigDecimal.ZERO;
                    String catName = m.getCategory() != null ? m.getCategory().getName() : "General";
                    String img = m.getImage() != null ? m.getImage()
                            : "https://images.unsplash.com/photo-1546833719-d2fe7042f651?auto=format&fit=crop&w=800&q=80";

                    double qShare = finalQtyTotal > 0
                            ? BigDecimal.valueOf(sold * 100.0)
                                    .divide(BigDecimal.valueOf(finalQtyTotal), 2, RoundingMode.HALF_UP).doubleValue()
                            : 0.0;
                    double rShare = finalRevTotal.compareTo(BigDecimal.ZERO) > 0
                            ? rev.multiply(BigDecimal.valueOf(100)).divide(finalRevTotal, 2, RoundingMode.HALF_UP)
                                    .doubleValue()
                            : 0.0;

                    return new TopDishDTO(m.getId(), m.getName(), catName, sold, rev, img, qShare, rShare, 0);
                })
                .sorted(Comparator.comparingLong(TopDishDTO::getQuantitySold)
                        .thenComparing(TopDishDTO::getTotalRevenue))
                .limit(limit)
                .collect(Collectors.toList());

        for (int i = 0; i < lowest.size(); i++) {
            lowest.get(i).setRank(i + 1);
        }

        return lowest;
    }

    @Override
    public List<CategorySalesDTO> getCategorySales() {
        List<Order> validOrders = orderRepository.findAll().stream()
                .filter(o -> o.getOrderStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());
        return getCategorySales(validOrders);
    }

    @Override
    public List<CategorySalesDTO> getCategorySales(List<Order> validOrders) {
        if (validOrders == null || validOrders.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, CategoryAccumulator> map = new LinkedHashMap<>();
        BigDecimal grandTotalRevenue = BigDecimal.ZERO;
        long grandTotalQuantity = 0;

        for (Order order : validOrders) {
            if (order.getItems() == null)
                continue;
            for (OrderItem item : order.getItems()) {
                String catName = item.getMenuItem() != null && item.getMenuItem().getCategory() != null
                        ? item.getMenuItem().getCategory().getName()
                        : "Main";
                CategoryAccumulator acc = map.computeIfAbsent(catName, k -> new CategoryAccumulator(catName));
                long qty = item.getQuantity() != null ? item.getQuantity() : 1;
                acc.itemsSold += qty;
                grandTotalQuantity += qty;

                BigDecimal sub = item.getSubtotal() != null
                        ? item.getSubtotal()
                        : (item.getPrice() != null ? item.getPrice().multiply(BigDecimal.valueOf(qty))
                                : BigDecimal.ZERO);
                acc.totalRevenue = acc.totalRevenue.add(sub);
                grandTotalRevenue = grandTotalRevenue.add(sub);
            }
        }

        final BigDecimal finalGrandTotalRevenue = grandTotalRevenue;
        final long finalGrandTotalQuantity = grandTotalQuantity;

        return map.values().stream()
                .map(acc -> {
                    double rShare = finalGrandTotalRevenue.compareTo(BigDecimal.ZERO) > 0
                            ? acc.totalRevenue.multiply(BigDecimal.valueOf(100))
                                    .divide(finalGrandTotalRevenue, 2, RoundingMode.HALF_UP).doubleValue()
                            : 0.0;
                    double qShare = finalGrandTotalQuantity > 0
                            ? BigDecimal.valueOf(acc.itemsSold * 100.0)
                                    .divide(BigDecimal.valueOf(finalGrandTotalQuantity), 2, RoundingMode.HALF_UP)
                                    .doubleValue()
                            : 0.0;

                    return new CategorySalesDTO(acc.categoryName, acc.itemsSold, acc.totalRevenue, qShare, rShare);
                })
                .sorted(Comparator.comparing(CategorySalesDTO::getTotalRevenue).reversed()
                        .thenComparing(CategorySalesDTO::getItemsSold, Comparator.reverseOrder()))
                .collect(Collectors.toList());
    }

    @Override
    public List<HourlyDemandDTO> getHourlyDemand() {
        List<Order> validOrders = orderRepository.findAll().stream()
                .filter(o -> o.getOrderStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());
        return getHourlyDemand(validOrders);
    }

    @Override
    public List<HourlyDemandDTO> getHourlyDemand(List<Order> validOrders) {
        Map<Integer, HourlyAccumulator> map = new LinkedHashMap<>();
        for (int h = 0; h < 24; h++) {
            map.put(h, new HourlyAccumulator(h));
        }

        long totalOrdersCount = 0;
        if (validOrders != null) {
            totalOrdersCount = validOrders.size();
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
        }

        final long finalTotalOrders = totalOrdersCount;

        return map.values().stream()
                .sorted(Comparator.comparingInt(HourlyAccumulator::getHour))
                .map(acc -> {
                    BigDecimal aov = acc.orderCount > 0
                            ? acc.totalRevenue.divide(BigDecimal.valueOf(acc.orderCount), 2, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;
                    double orderShare = finalTotalOrders > 0
                            ? BigDecimal.valueOf(acc.orderCount * 100.0)
                                    .divide(BigDecimal.valueOf(finalTotalOrders), 2, RoundingMode.HALF_UP).doubleValue()
                            : 0.0;
                    return new HourlyDemandDTO(acc.hour, acc.orderCount, acc.totalRevenue, aov, orderShare);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<DailyRevenueDTO> getDailyTrends(List<Order> validOrders) {
        if (validOrders == null || validOrders.isEmpty()) {
            return Collections.emptyList();
        }

        Map<LocalDate, List<Order>> ordersByDate = validOrders.stream()
                .collect(Collectors
                        .groupingBy(o -> o.getCreatedAt() != null ? o.getCreatedAt().toLocalDate() : LocalDate.now()));

        List<DailyRevenueDTO> dailyTrends = new ArrayList<>();
        ordersByDate.forEach((date, dateOrders) -> {
            BigDecimal dayRevenue = dateOrders.stream()
                    .map(Order::getGrandTotal)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            dailyTrends.add(new DailyRevenueDTO(date, dayRevenue, dateOrders.size()));
        });
        dailyTrends.sort(Comparator.comparing(DailyRevenueDTO::getDate));

        return dailyTrends;
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
