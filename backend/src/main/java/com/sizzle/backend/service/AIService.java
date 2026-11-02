package com.sizzle.backend.service;

import com.sizzle.backend.dto.AIRequest;
import com.sizzle.backend.dto.AIResponse;

public interface AIService {

    /**
     * Executes a general AI intelligence request with verification and fallback safety.
     *
     * @param request the structured AI request
     * @return the verified AI response
     */
    AIResponse executeRequest(AIRequest request);

    /**
     * Executes a minimal verification prompt for Sizzle Intelligence connectivity testing.
     *
     * @param testPrompt optional test prompt from the caller
     * @return minimal structured test response
     */
    AIResponse executeTestPrompt(String testPrompt);

    /**
     * Feature 1: AI Smart Preparation & Wait-Time Advisor for a single menu item.
     *
     * @param menuItemId ID of the menu item
     * @return structured wait time estimate and AI explanation
     */
    com.sizzle.backend.dto.WaitTimeResponse getWaitTimeEstimate(Long menuItemId);

    /**
     * Feature 1: AI Smart Preparation & Wait-Time Advisor for cart items.
     *
     * @param menuItemIds list of menu item IDs in the customer's cart
     * @return structured wait time estimate and AI explanation for the entire cart
     */
    com.sizzle.backend.dto.WaitTimeResponse getCartWaitTimeEstimate(java.util.List<Long> menuItemIds);

    /**
     * Feature 2: AI Meal & Basket Optimizer.
     * Curates an optimized meal basket from verified menu items based on customer constraints.
     *
     * @param request customer meal constraints (budget, people count, diet, spice, etc.)
     * @return structured, validated meal recommendation
     */
    com.sizzle.backend.dto.MealOptimizationResponse optimizeMeal(com.sizzle.backend.dto.MealOptimizationRequest request);

    /**
     * Feature 3: AI Restaurant Pulse Analytics.
     * Evaluates real restaurant metrics over a specified period (today, 7days, 30days)
     * and produces verified trends, bottlenecks, insights, and actionable recommendations.
     *
     * @param period "today", "7days", or "30days"
     * @return structured pulse analytics response
     */
    com.sizzle.backend.dto.RestaurantPulseResponse getRestaurantPulse(String period);

    /**
     * Feature 4: Restaurant What-If Copilot.
     * Simulates natural-language business scenarios (e.g. discount changes, volume surges,
     * menu removals, promo candidates) using verified historical sales baselines and
     * explicit transparent assumptions, accompanied by AI risk assessment and recommendations.
     *
     * @param request what-if query and optional parameters
     * @return structured scenario simulation and decision support
     */
    com.sizzle.backend.dto.WhatIfResponse simulateScenario(com.sizzle.backend.dto.WhatIfRequest request);
}

