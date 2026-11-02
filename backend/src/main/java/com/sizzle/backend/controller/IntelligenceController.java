package com.sizzle.backend.controller;

import com.sizzle.backend.dto.*;
import com.sizzle.backend.service.AIService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/intelligence")
public class IntelligenceController {

    private final AIService aiService;

    public IntelligenceController(AIService aiService) {
        this.aiService = aiService;
    }

    /**
     * Connectivity Diagnostic Endpoint.
     * Accessible by customers or health monitors to verify Sizzle Intelligence engine status.
     */
    @PostMapping("/test")
    public ResponseEntity<ApiResponse<AIResponse>> testAIConnectivity(
            @RequestBody(required = false) Map<String, String> payload) {
        String prompt = (payload != null) ? payload.get("prompt") : null;
        AIResponse response = aiService.executeTestPrompt(prompt);
        return ResponseEntity.ok(ApiResponse.success("Sizzle Intelligence test executed successfully", response));
    }

    /**
     * Feature 1: AI Smart Preparation / Wait-Time Advisor for a single menu item.
     * Calculates transparent deterministic estimate, then generates short friendly customer explanation.
     */
    @GetMapping("/wait-time/{menuItemId}")
    public ResponseEntity<ApiResponse<WaitTimeResponse>> getWaitTime(@PathVariable Long menuItemId) {
        WaitTimeResponse response = aiService.getWaitTimeEstimate(menuItemId);
        return ResponseEntity.ok(ApiResponse.success("Wait-time estimate calculated successfully", response));
    }

    /**
     * Feature 1 (Cart Support): AI Smart Preparation / Wait-Time Advisor for multiple items in cart.
     */
    @PostMapping("/wait-time/cart")
    public ResponseEntity<ApiResponse<WaitTimeResponse>> getCartWaitTime(
            @RequestBody(required = false) Map<String, List<Long>> payload) {
        List<Long> itemIds = Collections.emptyList();
        if (payload != null) {
            itemIds = payload.get("itemIds");
            if (itemIds == null) {
                itemIds = payload.get("menuItemIds");
            }
        }
        WaitTimeResponse response = aiService.getCartWaitTimeEstimate(itemIds);
        return ResponseEntity.ok(ApiResponse.success("Cart wait-time estimate calculated successfully", response));
    }

    /**
     * Feature 2: AI Meal & Basket Optimizer.
     * Curates a validated meal basket from real menu items matching customer constraints.
     * Accessible by customers (unauthenticated and authenticated).
     */
    @PostMapping("/optimize-meal")
    public ResponseEntity<ApiResponse<MealOptimizationResponse>> optimizeMeal(@Valid @RequestBody MealOptimizationRequest request) {
        MealOptimizationResponse response = aiService.optimizeMeal(request);
        return ResponseEntity.ok(ApiResponse.success("Meal basket optimized successfully", response));
    }

    /**
     * Feature 3: AI Restaurant Pulse Analytics & Infographics.
     * Evaluates verified operational metrics over a specified period (today, 7days, 30days, all, custom)
     * and produces concise actionable business insights, visual telemetry and recommendations.
     */
    @GetMapping("/restaurant-pulse")
    public ResponseEntity<ApiResponse<RestaurantPulseResponse>> getRestaurantPulse(
            @RequestParam(defaultValue = "7days") String period,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        RestaurantPulseResponse response = aiService.getRestaurantPulse(period, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Restaurant pulse analytics fetched successfully", response));
    }

    /**
     * Feature 4: Restaurant What-If Copilot.
     * Evaluates simulated business questions (discount, order volume changes, menu removals, promotions)
     * using real historical data and explicit assumptions for decision support.
     */
    @PostMapping("/what-if")
    public ResponseEntity<ApiResponse<WhatIfResponse>> simulateWhatIf(@Valid @RequestBody WhatIfRequest request) {
        WhatIfResponse response = aiService.simulateScenario(request);
        return ResponseEntity.ok(ApiResponse.success("Scenario simulation completed successfully", response));
    }
}
