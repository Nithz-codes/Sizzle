package com.sizzle.backend.service;

import com.sizzle.backend.dto.*;
import com.sizzle.backend.model.Order;

import java.util.List;

public interface AnalyticsService {
    AnalyticsOverviewResponse getOverview();
    List<TopDishDTO> getTopDishes(int limit);
    List<CategorySalesDTO> getCategorySales();
    List<HourlyDemandDTO> getHourlyDemand();

    // Filter-aware overloads for consistent operational analytics
    List<CategorySalesDTO> getCategorySales(List<Order> validOrders);
    List<TopDishDTO> getTopDishes(List<Order> validOrders, int limit);
    List<TopDishDTO> getLowestPerformingDishes(List<Order> validOrders, int limit);
    List<HourlyDemandDTO> getHourlyDemand(List<Order> validOrders);
    List<DailyRevenueDTO> getDailyTrends(List<Order> validOrders);
}
