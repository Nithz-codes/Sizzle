package com.sizzle.backend.service;

import com.sizzle.backend.dto.AIRequest;
import com.sizzle.backend.dto.AIResponse;
import com.sizzle.backend.dto.MealOptimizationRequest;
import com.sizzle.backend.dto.MealOptimizationResponse;
import com.sizzle.backend.dto.RestaurantPulseResponse;
import com.sizzle.backend.dto.WaitTimeResponse;
import com.sizzle.backend.dto.WhatIfRequest;
import com.sizzle.backend.dto.WhatIfResponse;

import java.util.List;

public interface AIService {

    AIResponse executeRequest(AIRequest request);

    AIResponse executeTestPrompt(String testPrompt);

    WaitTimeResponse getWaitTimeEstimate(Long menuItemId);

    WaitTimeResponse getCartWaitTimeEstimate(List<Long> menuItemIds);

    MealOptimizationResponse optimizeMeal(MealOptimizationRequest request);

    RestaurantPulseResponse getRestaurantPulse(String period);

    RestaurantPulseResponse getRestaurantPulse(String period, String startDate, String endDate);

    WhatIfResponse simulateScenario(WhatIfRequest request);
}
