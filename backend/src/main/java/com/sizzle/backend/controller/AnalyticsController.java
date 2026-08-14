package com.sizzle.backend.controller;

import com.sizzle.backend.dto.*;
import com.sizzle.backend.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<AnalyticsOverviewResponse>> getOverview() {
        AnalyticsOverviewResponse overview = analyticsService.getOverview();
        return ResponseEntity.ok(ApiResponse.success("Analytics overview fetched successfully", overview));
    }

    @GetMapping("/top-dishes")
    public ResponseEntity<ApiResponse<List<TopDishDTO>>> getTopDishes(@RequestParam(defaultValue = "5") int limit) {
        List<TopDishDTO> topDishes = analyticsService.getTopDishes(limit);
        return ResponseEntity.ok(ApiResponse.success("Top dishes fetched successfully", topDishes));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategorySalesDTO>>> getCategorySales() {
        List<CategorySalesDTO> categories = analyticsService.getCategorySales();
        return ResponseEntity.ok(ApiResponse.success("Category sales fetched successfully", categories));
    }

    @GetMapping("/hourly")
    public ResponseEntity<ApiResponse<List<HourlyDemandDTO>>> getHourlyDemand() {
        List<HourlyDemandDTO> hourly = analyticsService.getHourlyDemand();
        return ResponseEntity.ok(ApiResponse.success("Hourly demand fetched successfully", hourly));
    }
}
