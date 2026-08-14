package com.sizzle.backend.service;

import com.sizzle.backend.dto.*;

import java.util.List;

public interface AnalyticsService {
    AnalyticsOverviewResponse getOverview();
    List<TopDishDTO> getTopDishes(int limit);
    List<CategorySalesDTO> getCategorySales();
    List<HourlyDemandDTO> getHourlyDemand();
}
