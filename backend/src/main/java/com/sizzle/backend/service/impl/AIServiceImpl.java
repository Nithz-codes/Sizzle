package com.sizzle.backend.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sizzle.backend.dto.AIRequest;
import com.sizzle.backend.dto.AIResponse;
import com.sizzle.backend.dto.MealOptimizationRequest;
import com.sizzle.backend.dto.MealOptimizationResponse;
import com.sizzle.backend.dto.OptimizedBasketItem;
import com.sizzle.backend.dto.PulseInsight;
import com.sizzle.backend.dto.RestaurantPulseResponse;
import com.sizzle.backend.dto.WaitTimeResponse;
import com.sizzle.backend.dto.WhatIfImpact;
import com.sizzle.backend.dto.WhatIfRequest;
import com.sizzle.backend.dto.WhatIfResponse;
import com.sizzle.backend.dto.WhatIfState;
import com.sizzle.backend.exception.ResourceNotFoundException;
import com.sizzle.backend.model.InventoryItem;
import com.sizzle.backend.model.MenuItem;
import com.sizzle.backend.model.Order;
import com.sizzle.backend.model.OrderItem;
import com.sizzle.backend.model.OrderStatus;
import com.sizzle.backend.model.StockStatus;
import com.sizzle.backend.repository.InventoryRepository;
import com.sizzle.backend.repository.MenuItemRepository;
import com.sizzle.backend.repository.OrderRepository;
import com.sizzle.backend.service.AIClient;
import com.sizzle.backend.service.AIService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AIServiceImpl implements AIService {

    private static final Logger log = LoggerFactory.getLogger(AIServiceImpl.class);

    private final AIClient aiClient;
    private final MenuItemRepository menuItemRepository;
    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final ObjectMapper objectMapper;
    private final com.sizzle.backend.service.AnalyticsService analyticsService;

    public AIServiceImpl(AIClient aiClient,
                          MenuItemRepository menuItemRepository,
                          OrderRepository orderRepository,
                          InventoryRepository inventoryRepository,
                          ObjectMapper objectMapper,
                          com.sizzle.backend.service.AnalyticsService analyticsService) {
        this.aiClient = aiClient;
        this.menuItemRepository = menuItemRepository;
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
        this.objectMapper = objectMapper;
        this.analyticsService = analyticsService;
    }

    @Override
    public AIResponse executeRequest(AIRequest request) {
        log.info("Executing Sizzle Intelligence request [jsonMode={}]", request.isJsonMode());
        return aiClient.execute(request);
    }

    @Override
    public AIResponse executeTestPrompt(String testPrompt) {
        log.info("Executing Sizzle Intelligence verification test");

        if (!aiClient.isConfigured()) {
            log.info("AI provider is not configured. Returning structured verification fallback.");
            Map<String, Object> testData = new LinkedHashMap<>();
            testData.put("status", "READY_OFFLINE");
            testData.put("product", "Sizzle Intelligence");
            testData.put("message", "Sizzle Intelligence layer is online in fallback mode. Set AI_API_KEY to activate cloud AI features.");
            testData.put("timestamp", LocalDateTime.now().toString());

            return AIResponse.builder()
                    .status("FALLBACK")
                    .text("Sizzle Intelligence is operating in offline fallback mode.")
                    .structuredData(testData)
                    .fallback(true)
                    .fallbackReason("No cloud AI credentials provided in environment.")
                    .build();
        }

        String prompt = (testPrompt != null && !testPrompt.isBlank())
                ? testPrompt
                : "Perform a Sizzle Intelligence backend connectivity diagnostic test.";

        AIRequest request = AIRequest.builder()
                .prompt(prompt)
                .systemInstruction("You are Sizzle Intelligence, an AI culinary assistant for Sizzle Restaurant. " +
                        "Respond strictly with a valid JSON object containing: " +
                        "'status' (string, value 'ONLINE'), " +
                        "'product' (string, value 'Sizzle Intelligence'), " +
                        "'message' (string, a brief confirmation sentence), " +
                        "'serverTime' (string, ISO timestamp). " +
                        "Do not mention any external third-party provider or model names.")
                .temperature(0.2)
                .jsonMode(true)
                .build();

        return aiClient.execute(request);
    }

    @Override
    public WaitTimeResponse getWaitTimeEstimate(Long menuItemId) {
        if (menuItemId == null) {
            throw new IllegalArgumentException("Menu item ID cannot be null");
        }

        MenuItem item = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item with ID " + menuItemId + " not found"));

        int baseMinutes = parseBasePrepMinutes(item.getPrepTime());
        int complexityMinutes = calculateComplexityMinutes(item);

        long activeOrdersCount = orderRepository.countByOrderStatusIn(List.of(OrderStatus.PENDING, OrderStatus.PREPARING));
        int activeOrders = (int) activeOrdersCount;

        int queueLoadMinutes = calculateQueueLoadMinutes(activeOrders);
        String kitchenStatus = determineKitchenStatus(activeOrders);
        String confidence = determineConfidence(activeOrders);

        // Core deterministic preparation estimate
        int estimatedMinutes = Math.max(5, baseMinutes + queueLoadMinutes + complexityMinutes);

        String reason = String.format("Base preparation: %d min + Kitchen workload: +%d min (%d active %s) + Recipe complexity: +%d min",
                baseMinutes, queueLoadMinutes, activeOrders, activeOrders == 1 ? "order" : "orders", complexityMinutes);

        String explanation = generateCustomerExplanation(item.getName(), baseMinutes, queueLoadMinutes, complexityMinutes,
                activeOrders, estimatedMinutes, kitchenStatus);

        return WaitTimeResponse.builder()
                .menuItemId(item.getId())
                .menuItemName(item.getName())
                .estimatedMinutes(estimatedMinutes)
                .confidence(confidence)
                .kitchenStatus(kitchenStatus)
                .baseMinutes(baseMinutes)
                .queueLoadMinutes(queueLoadMinutes)
                .complexityMinutes(complexityMinutes)
                .activeKitchenOrders(activeOrders)
                .reason(reason)
                .generatedExplanation(explanation)
                .build();
    }

    @Override
    public WaitTimeResponse getCartWaitTimeEstimate(List<Long> menuItemIds) {
        if (menuItemIds == null || menuItemIds.isEmpty()) {
            throw new IllegalArgumentException("Cart cannot be empty for wait-time estimation");
        }

        List<MenuItem> items = menuItemRepository.findAllById(menuItemIds);
        if (items.isEmpty()) {
            throw new ResourceNotFoundException("No valid menu items found for given IDs");
        }

        int maxBase = items.stream().mapToInt(i -> parseBasePrepMinutes(i.getPrepTime())).max().orElse(15);
        int maxComplexity = items.stream().mapToInt(this::calculateComplexityMinutes).max().orElse(2);
        int multiDishBuffer = Math.min(6, (items.size() - 1) * 2);

        long activeOrdersCount = orderRepository.countByOrderStatusIn(List.of(OrderStatus.PENDING, OrderStatus.PREPARING));
        int activeOrders = (int) activeOrdersCount;

        int queueLoadMinutes = calculateQueueLoadMinutes(activeOrders);
        String kitchenStatus = determineKitchenStatus(activeOrders);
        String confidence = determineConfidence(activeOrders);

        int estimatedMinutes = Math.max(5, maxBase + queueLoadMinutes + maxComplexity + multiDishBuffer);

        String reason = String.format("Longest item prep: %d min + Kitchen workload: +%d min (%d active %s) + Recipe complexity: +%d min + Multi-dish buffer: +%d min (%d items)",
                maxBase, queueLoadMinutes, activeOrders, activeOrders == 1 ? "order" : "orders", maxComplexity, multiDishBuffer, items.size());

        String cartSummary = items.size() + " items (including " + items.get(0).getName() + (items.size() > 1 ? ", etc.)" : ")");
        String explanation = generateCustomerExplanation(cartSummary, maxBase, queueLoadMinutes, maxComplexity + multiDishBuffer,
                activeOrders, estimatedMinutes, kitchenStatus);

        return WaitTimeResponse.builder()
                .menuItemId(items.get(0).getId())
                .menuItemName(cartSummary)
                .estimatedMinutes(estimatedMinutes)
                .confidence(confidence)
                .kitchenStatus(kitchenStatus)
                .baseMinutes(maxBase)
                .queueLoadMinutes(queueLoadMinutes)
                .complexityMinutes(maxComplexity + multiDishBuffer)
                .activeKitchenOrders(activeOrders)
                .reason(reason)
                .generatedExplanation(explanation)
                .build();
    }

    private int parseBasePrepMinutes(String prepTimeStr) {
        if (prepTimeStr == null || prepTimeStr.isBlank()) {
            return 15;
        }
        Pattern pattern = Pattern.compile("(\\d+)(?:\\s*-\\s*(\\d+))?");
        Matcher matcher = pattern.matcher(prepTimeStr);
        if (matcher.find()) {
            if (matcher.group(2) != null) {
                return Integer.parseInt(matcher.group(2));
            } else {
                return Integer.parseInt(matcher.group(1));
            }
        }
        return 15;
    }

    private int calculateComplexityMinutes(MenuItem item) {
        if (item == null || item.getCategory() == null || item.getCategory().getName() == null) {
            return 2;
        }
        String categoryName = item.getCategory().getName().toLowerCase();
        String itemName = item.getName() != null ? item.getName().toLowerCase() : "";

        if (categoryName.contains("grill") || categoryName.contains("biryani") || categoryName.contains("pizza") || itemName.contains("tandoori")) {
            return 4;
        }
        if (categoryName.contains("curry") || categoryName.contains("pasta") || categoryName.contains("burger") || categoryName.contains("chinese")) {
            return 2;
        }
        if (categoryName.contains("starter") || categoryName.contains("dessert")) {
            return 1;
        }
        return 0;
    }

    private int calculateQueueLoadMinutes(int activeOrders) {
        if (activeOrders <= 0) return 0;
        if (activeOrders == 1) return 3;
        if (activeOrders == 2) return 6;
        if (activeOrders <= 4) return 6 + (activeOrders - 2) * 3;
        return Math.min(20, 12 + (activeOrders - 4) * 2);
    }

    private String determineKitchenStatus(int activeOrders) {
        if (activeOrders <= 1) return "LIGHT";
        if (activeOrders <= 4) return "MODERATE";
        return "BUSY";
    }

    private String determineConfidence(int activeOrders) {
        if (activeOrders <= 2) return "HIGH";
        if (activeOrders <= 5) return "MEDIUM";
        return "LOW";
    }

    private String generateCustomerExplanation(String dishOrCart, int baseMinutes, int queueLoad, int complexity,
                                                int activeOrders, int estimatedMinutes, String kitchenStatus) {
        String deterministicFallback;
        if ("LIGHT".equals(kitchenStatus)) {
            deterministicFallback = String.format("Estimated preparation time is about %d minutes. The kitchen workload is currently light.", estimatedMinutes);
        } else if ("MODERATE".equals(kitchenStatus)) {
            deterministicFallback = String.format("Estimated preparation time is about %d minutes because the kitchen is actively handling %d active %s.",
                    estimatedMinutes, activeOrders, activeOrders == 1 ? "order" : "orders");
        } else {
            deterministicFallback = String.format("Estimated preparation time is about %d minutes due to high kitchen order volume (%d orders in queue).",
                    estimatedMinutes, activeOrders);
        }

        if (!aiClient.isConfigured()) {
            return deterministicFallback;
        }

        try {
            String prompt = String.format(
                    "Dish/Order: %s. Base preparation time: %d min. Kitchen queue adjustment: +%d min (%d active kitchen orders). " +
                    "Recipe complexity: +%d min. Total calculated wait time: %d minutes. Kitchen load status: %s. " +
                    "Write a single natural, friendly customer sentence explaining why this order will take about %d minutes. " +
                    "CRITICAL: You must NOT change or recalculate the %d minutes. Maximum 25 words.",
                    dishOrCart, baseMinutes, queueLoad, activeOrders, complexity, estimatedMinutes, kitchenStatus, estimatedMinutes, estimatedMinutes
            );

            AIRequest request = AIRequest.builder()
                    .prompt(prompt)
                    .systemInstruction("You are Sizzle Intelligence, an AI kitchen preparation advisor for Sizzle Restaurant. " +
                            "Output strictly a JSON object: {\"explanation\": \"<single sentence>\"}. " +
                            "Do not mention any external AI models or technical provider names.")
                    .temperature(0.3)
                    .jsonMode(true)
                    .build();

            AIResponse aiResponse = aiClient.execute(request);
            if (aiResponse != null && !aiResponse.isFallback() && aiResponse.getStructuredData() != null) {
                if (aiResponse.getStructuredData() instanceof Map<?, ?> dataMap) {
                    Object exp = dataMap.get("explanation");
                    if (exp != null && !exp.toString().isBlank()) {
                        String explanation = exp.toString().trim();
                        if (explanation.contains(String.valueOf(estimatedMinutes)) || explanation.length() < 120) {
                            return explanation;
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Sizzle Intelligence could not generate AI wait-time explanation; using deterministic fallback: {}", e.getMessage());
        }

        return deterministicFallback;
    }

    @Override
    public MealOptimizationResponse optimizeMeal(MealOptimizationRequest request) {
        if (request == null) {
            request = MealOptimizationRequest.builder().maxBudget(BigDecimal.valueOf(500)).build();
        }

        BigDecimal budget = request.getMaxBudget();
        if (budget == null || budget.compareTo(BigDecimal.valueOf(50)) < 0) {
            return MealOptimizationResponse.builder()
                    .items(Collections.emptyList())
                    .totalPrice(BigDecimal.ZERO)
                    .maxBudget(budget != null ? budget : BigDecimal.ZERO)
                    .budgetRemaining(budget != null ? budget : BigDecimal.ZERO)
                    .estimatedPreparationMinutes(0)
                    .peopleCount(request.getPeopleCount() != null ? request.getPeopleCount() : 2)
                    .summary("Please specify a budget of at least ₹50 to optimize a meal basket.")
                    .confidence("LOW")
                    .source("DETERMINISTIC_FALLBACK")
                    .build();
        }

        int people = (request.getPeopleCount() != null && request.getPeopleCount() >= 1) ? request.getPeopleCount() : 2;

        List<MenuItem> allAvailable = menuItemRepository.findByIsAvailableTrue();
        List<MenuItem> candidates = filterCandidates(allAvailable, request);

        if (candidates.isEmpty()) {
            return MealOptimizationResponse.builder()
                    .items(Collections.emptyList())
                    .totalPrice(BigDecimal.ZERO)
                    .maxBudget(budget)
                    .budgetRemaining(budget)
                    .estimatedPreparationMinutes(0)
                    .peopleCount(people)
                    .summary("No menu items matched your constraints within ₹" + budget.toPlainString() + ". Try broadening your dietary filter or increasing your budget.")
                    .confidence("LOW")
                    .source("DETERMINISTIC_FALLBACK")
                    .build();
        }

        Map<Long, MenuItem> candidateMap = candidates.stream()
                .collect(Collectors.toMap(MenuItem::getId, m -> m, (m1, m2) -> m1));

        MealOptimizationResponse response = null;

        if (aiClient.isConfigured()) {
            try {
                response = generateAiMealOptimization(candidates, candidateMap, request, people, budget);
            } catch (Exception e) {
                log.warn("AI meal optimization failed; falling back to deterministic meal builder: {}", e.getMessage());
            }
        }

        if (response == null || response.getItems() == null || response.getItems().isEmpty()) {
            log.info("Using deterministic meal optimizer fallback for budget: ₹{}", budget);
            response = buildDeterministicMealFallback(candidates, request, people, budget);
        }

        List<Long> selectedIds = response.getItems().stream()
                .map(OptimizedBasketItem::getMenuItemId)
                .toList();

        int prepTime = calculatePrepTimeForItems(selectedIds);
        response.setEstimatedPreparationMinutes(prepTime);

        return response;
    }

    private List<MenuItem> filterCandidates(List<MenuItem> allAvailable, MealOptimizationRequest request) {
        BigDecimal budget = request.getMaxBudget();
        String diet = (request.getDietaryPreference() != null) ? request.getDietaryPreference().toUpperCase() : "ANY";
        String spice = (request.getSpicyPreference() != null) ? request.getSpicyPreference().toUpperCase() : "ANY";
        Integer maxPrep = request.getMaxPrepTimeMinutes();
        List<String> preferredCategories = request.getPreferredCategories();

        return allAvailable.stream()
                .filter(m -> m.getPrice() != null && m.getPrice().compareTo(budget) <= 0)
                .filter(m -> {
                    if ("VEG_ONLY".equals(diet)) return Boolean.TRUE.equals(m.getIsVeg());
                    if ("NON_VEG".equals(diet)) return !Boolean.TRUE.equals(m.getIsVeg());
                    return true;
                })
                .filter(m -> {
                    int spicy = (m.getSpicyLevel() != null) ? m.getSpicyLevel() : 0;
                    if ("MILD".equals(spice)) return spicy <= 1;
                    return true;
                })
                .filter(m -> {
                    if (maxPrep != null && maxPrep > 0) {
                        return parseBasePrepMinutes(m.getPrepTime()) <= maxPrep;
                    }
                    return true;
                })
                .sorted((a, b) -> {
                    if (preferredCategories != null && !preferredCategories.isEmpty()) {
                        String catA = a.getCategory() != null ? a.getCategory().getName() : "";
                        String catB = b.getCategory() != null ? b.getCategory().getName() : "";
                        boolean aMatch = preferredCategories.stream().anyMatch(catA::equalsIgnoreCase);
                        boolean bMatch = preferredCategories.stream().anyMatch(catB::equalsIgnoreCase);
                        if (aMatch && !bMatch) return -1;
                        if (!aMatch && bMatch) return 1;
                    }
                    double rA = a.getRating() != null ? a.getRating() : 4.0;
                    double rB = b.getRating() != null ? b.getRating() : 4.0;
                    return Double.compare(rB, rA);
                })
                .limit(25)
                .toList();
    }

    private MealOptimizationResponse generateAiMealOptimization(List<MenuItem> candidates,
                                                                 Map<Long, MenuItem> candidateMap,
                                                                 MealOptimizationRequest request,
                                                                 int people,
                                                                 BigDecimal budget) {
        List<Map<String, Object>> candidateList = candidates.stream()
                .limit(25)
                .map(m -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", m.getId());
                    map.put("name", m.getName());
                    map.put("price", m.getPrice().doubleValue());
                    map.put("isVeg", m.getIsVeg());
                    map.put("spicyLevel", m.getSpicyLevel() != null ? m.getSpicyLevel() : 0);
                    map.put("category", m.getCategory() != null ? m.getCategory().getName() : "General");
                    map.put("prepMin", parseBasePrepMinutes(m.getPrepTime()));
                    return map;
                })
                .toList();

        String candidatesJson;
        try {
            candidatesJson = objectMapper.writeValueAsString(candidateList);
        } catch (Exception e) {
            candidatesJson = "[]";
        }

        String freeText = (request.getFreeTextRequest() != null && !request.getFreeTextRequest().isBlank())
                ? "Customer notes: \"" + request.getFreeTextRequest().trim() + "\"."
                : "";

        String prompt = String.format(
                "You are an expert culinary meal planner. Curate an optimized meal basket for %d people within a strict maximum budget of ₹%s.\n" +
                "Dietary requirement: %s. Spicy preference: %s. %s\n\n" +
                "Available candidates (ONLY choose from these IDs):\n%s\n\n" +
                "Requirements:\n" +
                "1. Choose 2 to 6 dishes that together form a complete, satisfying meal (mains, sides/breads, drinks/desserts as appropriate).\n" +
                "2. Respect dietary requirements strictly (if VEG_ONLY, zero non-veg; if MIXED_ONE_VEG, at least one veg and one non-veg).\n" +
                "3. Sum of (dish price * quantity) MUST be <= ₹%s.\n" +
                "4. Output strictly a JSON object with this structure:\n" +
                "{\n" +
                "  \"items\": [\n" +
                "    {\"menuItemId\": <id>, \"quantity\": <int>, \"reason\": \"<short reason for this dish>\"}\n" +
                "  ],\n" +
                "  \"summary\": \"<friendly explanation of why this combination was chosen>\"\n" +
                "}\n" +
                "5. Never invent menu IDs or items not in the list.",
                people, budget.toPlainString(), request.getDietaryPreference(), request.getSpicyPreference(),
                freeText, candidatesJson, budget.toPlainString()
        );

        AIRequest aiReq = AIRequest.builder()
                .prompt(prompt)
                .systemInstruction("You are Sizzle Intelligence, an AI meal and basket optimizer for Sizzle Restaurant. " +
                        "Respond strictly in valid JSON without backticks or markdown preamble. " +
                        "Do NOT mention any external AI models, providers, or internal IDs in the user-facing summary.")
                .temperature(0.4)
                .jsonMode(true)
                .build();

        AIResponse aiRes = aiClient.execute(aiReq);
        if (aiRes == null || aiRes.isFallback() || aiRes.getStructuredData() == null) {
            return null;
        }

        return validateAndBuildMealResponse(aiRes.getStructuredData(), candidateMap, budget, people, "AI");
    }

    private MealOptimizationResponse validateAndBuildMealResponse(Object structuredData,
                                                                   Map<Long, MenuItem> candidateMap,
                                                                   BigDecimal budget,
                                                                   int people,
                                                                   String source) {
        if (!(structuredData instanceof Map<?, ?> dataMap)) {
            return null;
        }

        Object itemsObj = dataMap.get("items");
        if (!(itemsObj instanceof List<?> rawList) || rawList.isEmpty()) {
            return null;
        }

        List<OptimizedBasketItem> verifiedItems = new ArrayList<>();
        BigDecimal currentTotal = BigDecimal.ZERO;

        for (Object itemObj : rawList) {
            if (!(itemObj instanceof Map<?, ?> itemMap)) continue;

            Object idObj = itemMap.get("menuItemId");
            if (idObj == null) idObj = itemMap.get("id");
            if (idObj == null) continue;

            Long itemId;
            try {
                itemId = Long.valueOf(idObj.toString().trim());
            } catch (NumberFormatException e) {
                continue;
            }

            MenuItem dbItem = candidateMap.get(itemId);
            if (dbItem == null || !Boolean.TRUE.equals(dbItem.getIsAvailable())) {
                log.warn("Discarding invalid or unavailable item ID {} from AI recommendation", itemId);
                continue;
            }

            int qty = 1;
            Object qtyObj = itemMap.get("quantity");
            if (qtyObj != null) {
                try {
                    qty = Math.max(1, Math.min(10, Integer.parseInt(qtyObj.toString().trim())));
                } catch (NumberFormatException ignored) {}
            }

            String reason = (itemMap.get("reason") != null) ? itemMap.get("reason").toString() : "Recommended for your meal";

            BigDecimal lineTotal = dbItem.getPrice().multiply(BigDecimal.valueOf(qty));

            if (currentTotal.add(lineTotal).compareTo(budget) > 0) {
                if (qty > 1 && currentTotal.add(dbItem.getPrice()).compareTo(budget) <= 0) {
                    qty = 1;
                    lineTotal = dbItem.getPrice();
                } else {
                    continue;
                }
            }

            currentTotal = currentTotal.add(lineTotal);

            verifiedItems.add(createBasketItem(dbItem, qty, reason));
        }

        if (verifiedItems.isEmpty()) {
            return null;
        }

        String summary = (dataMap.get("summary") != null)
                ? dataMap.get("summary").toString().trim()
                : String.format("Optimized meal curated for %d people within your ₹%s budget.", people, budget.toPlainString());

        BigDecimal budgetRemaining = budget.subtract(currentTotal);

        return MealOptimizationResponse.builder()
                .items(verifiedItems)
                .totalPrice(currentTotal)
                .maxBudget(budget)
                .budgetRemaining(budgetRemaining)
                .peopleCount(people)
                .summary(summary)
                .confidence("HIGH")
                .source(source)
                .build();
    }

    private MealOptimizationResponse buildDeterministicMealFallback(List<MenuItem> candidates,
                                                                     MealOptimizationRequest request,
                                                                     int people,
                                                                     BigDecimal budget) {
        String diet = (request.getDietaryPreference() != null) ? request.getDietaryPreference() : "ANY";

        List<OptimizedBasketItem> selected = new ArrayList<>();
        BigDecimal currentTotal = BigDecimal.ZERO;

        List<MenuItem> mains = new ArrayList<>();
        List<MenuItem> sides = new ArrayList<>();
        List<MenuItem> drinksAndDesserts = new ArrayList<>();

        for (MenuItem item : candidates) {
            String cat = (item.getCategory() != null) ? item.getCategory().getName().toLowerCase() : "";
            if (cat.contains("biryani") || cat.contains("curry") || cat.contains("burger") || cat.contains("pizza") || cat.contains("pasta") || cat.contains("chinese")) {
                mains.add(item);
            } else if (cat.contains("bread") || cat.contains("starter") || cat.contains("grill")) {
                sides.add(item);
            } else {
                drinksAndDesserts.add(item);
            }
        }

        if ("MIXED_ONE_VEG".equalsIgnoreCase(diet)) {
            Optional<MenuItem> vegMain = mains.stream().filter(m -> Boolean.TRUE.equals(m.getIsVeg())).findFirst();
            if (vegMain.isPresent() && currentTotal.add(vegMain.get().getPrice()).compareTo(budget) <= 0) {
                MenuItem vm = vegMain.get();
                currentTotal = currentTotal.add(vm.getPrice());
                selected.add(createBasketItem(vm, 1, "Vegetarian main dish"));
            }
            Optional<MenuItem> nonVegMain = mains.stream().filter(m -> !Boolean.TRUE.equals(m.getIsVeg())).findFirst();
            if (nonVegMain.isPresent() && currentTotal.add(nonVegMain.get().getPrice()).compareTo(budget) <= 0) {
                MenuItem nvm = nonVegMain.get();
                currentTotal = currentTotal.add(nvm.getPrice());
                selected.add(createBasketItem(nvm, 1, "Non-vegetarian main course"));
            }
        } else {
            for (MenuItem m : mains) {
                if (selected.size() >= Math.min(3, Math.max(1, people))) break;
                if (currentTotal.add(m.getPrice()).compareTo(budget) <= 0) {
                    currentTotal = currentTotal.add(m.getPrice());
                    selected.add(createBasketItem(m, 1, "Popular main course"));
                }
            }
        }

        for (MenuItem s : sides) {
            if (selected.size() >= people + 1) break;
            if (currentTotal.add(s.getPrice()).compareTo(budget) <= 0) {
                currentTotal = currentTotal.add(s.getPrice());
                selected.add(createBasketItem(s, 1, "Complementary side or bread"));
                break;
            }
        }

        for (MenuItem d : drinksAndDesserts) {
            if (currentTotal.add(d.getPrice()).compareTo(budget) <= 0) {
                currentTotal = currentTotal.add(d.getPrice());
                selected.add(createBasketItem(d, 1, "Refreshing accompaniment"));
                break;
            }
        }

        if (selected.isEmpty()) {
            Optional<MenuItem> cheapest = candidates.stream().min(Comparator.comparing(MenuItem::getPrice));
            if (cheapest.isPresent() && cheapest.get().getPrice().compareTo(budget) <= 0) {
                MenuItem ch = cheapest.get();
                currentTotal = ch.getPrice();
                selected.add(createBasketItem(ch, 1, "Best match within budget"));
            }
        }

        String summary = String.format(
                "Balanced %d-item meal tailored for %d %s within ₹%s budget.",
                selected.size(), people, (people == 1 ? "person" : "people"), budget.toPlainString()
        );

        return MealOptimizationResponse.builder()
                .items(selected)
                .totalPrice(currentTotal)
                .maxBudget(budget)
                .budgetRemaining(budget.subtract(currentTotal))
                .peopleCount(people)
                .summary(summary)
                .confidence("MEDIUM")
                .source("DETERMINISTIC_FALLBACK")
                .build();
    }

    private OptimizedBasketItem createBasketItem(MenuItem item, int qty, String reason) {
        BigDecimal lineTotal = item.getPrice().multiply(BigDecimal.valueOf(qty));
        return OptimizedBasketItem.builder()
                .menuItemId(item.getId())
                .name(item.getName())
                .category(item.getCategory() != null ? item.getCategory().getName() : "General")
                .image(item.getImage())
                .isVeg(item.getIsVeg())
                .spicyLevel(item.getSpicyLevel())
                .price(item.getPrice())
                .quantity(qty)
                .lineTotal(lineTotal)
                .reason(reason)
                .build();
    }

    private int calculatePrepTimeForItems(List<Long> itemIds) {
        if (itemIds == null || itemIds.isEmpty()) return 15;
        List<MenuItem> items = menuItemRepository.findAllById(itemIds);
        if (items.isEmpty()) return 15;

        int maxBase = items.stream().mapToInt(i -> parseBasePrepMinutes(i.getPrepTime())).max().orElse(15);
        int maxComplexity = items.stream().mapToInt(this::calculateComplexityMinutes).max().orElse(2);
        int multiDishBuffer = Math.min(6, (items.size() - 1) * 2);

        long activeOrdersCount = orderRepository.countByOrderStatusIn(List.of(OrderStatus.PENDING, OrderStatus.PREPARING));
        int queueLoad = calculateQueueLoadMinutes((int) activeOrdersCount);

        return Math.max(5, maxBase + queueLoad + maxComplexity + multiDishBuffer);
    }

    @Override
    public RestaurantPulseResponse getRestaurantPulse(String period) {
        String cleanPeriod = (period != null && !period.isBlank()) ? period.toLowerCase().trim() : "7days";
        LocalDateTime since;
        String periodLabel;

        if ("today".equals(cleanPeriod)) {
            since = LocalDate.now().atStartOfDay();
            periodLabel = "Today";
        } else if ("30days".equals(cleanPeriod)) {
            since = LocalDate.now().minusDays(30).atStartOfDay();
            periodLabel = "Last 30 Days";
        } else {
            cleanPeriod = "7days";
            since = LocalDate.now().minusDays(7).atStartOfDay();
            periodLabel = "Last 7 Days";
        }

        // Fetch orders in period
        List<Order> ordersInPeriod = orderRepository.findByCreatedAtAfterOrderByCreatedAtDesc(since);
        if (ordersInPeriod.isEmpty()) {
            // If no orders in specific window, check all orders so we don't return an empty pulse if DB has data
            ordersInPeriod = orderRepository.findAllByOrderByCreatedAtDesc();
        }

        List<Order> validOrders = ordersInPeriod.stream()
                .filter(o -> o.getOrderStatus() != OrderStatus.CANCELLED)
                .toList();

        // 1. Core financial metrics
        long totalOrders = validOrders.size();
        BigDecimal totalRevenue = validOrders.stream()
                .map(Order::getGrandTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal aov = totalOrders > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // 2. Dish Performance
        Map<String, Long> dishQtyMap = new HashMap<>();
        Map<String, BigDecimal> dishRevMap = new HashMap<>();

        for (Order o : validOrders) {
            if (o.getItems() == null) continue;
            for (OrderItem item : o.getItems()) {
                String name = (item.getItemName() != null) ? item.getItemName() : "Menu Dish";
                long qty = (item.getQuantity() != null) ? item.getQuantity() : 1;
                dishQtyMap.merge(name, qty, Long::sum);

                BigDecimal subtotal = (item.getSubtotal() != null)
                        ? item.getSubtotal()
                        : (item.getPrice() != null ? item.getPrice().multiply(BigDecimal.valueOf(qty)) : BigDecimal.ZERO);
                dishRevMap.merge(name, subtotal, BigDecimal::add);
            }
        }

        String topItem = "Chicken Biryani";
        long topQty = 0;
        if (!dishQtyMap.isEmpty()) {
            Map.Entry<String, Long> topEntry = dishQtyMap.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .orElse(null);
            if (topEntry != null) {
                topItem = topEntry.getKey();
                topQty = topEntry.getValue();
            }
        }

        // Find least performing item from menu
        List<MenuItem> allMenuItems = menuItemRepository.findByIsAvailableTrue();
        String leastItem = "Veg Pasta";
        if (!allMenuItems.isEmpty()) {
            leastItem = allMenuItems.stream()
                    .min(Comparator.comparingLong(m -> dishQtyMap.getOrDefault(m.getName(), 0L)))
                    .map(MenuItem::getName)
                    .orElse("Veg Pasta");
        }

        // 3. Hourly traffic
        int[] hourlyOrders = new int[24];
        for (Order o : validOrders) {
            LocalDateTime dt = (o.getCreatedAt() != null) ? o.getCreatedAt() : LocalDateTime.now();
            hourlyOrders[dt.getHour()]++;
        }

        int maxHour = 19;
        int maxHourCount = -1;
        for (int h = 0; h < 24; h++) {
            if (hourlyOrders[h] > maxHourCount) {
                maxHourCount = hourlyOrders[h];
                maxHour = h;
            }
        }
        String peakHour = String.format("%02d:00 - %02d:00", maxHour, (maxHour + 2) % 24);

        int minHour = 15;
        int minHourCount = Integer.MAX_VALUE;
        for (int h = 11; h <= 22; h++) {
            if (h != maxHour && hourlyOrders[h] < minHourCount) {
                minHourCount = hourlyOrders[h];
                minHour = h;
            }
        }
        String slowHour = String.format("%02d:00 - %02d:00", minHour, (minHour + 2) % 24);

        // 4. Inventory Warnings
        List<InventoryItem> allInventory = inventoryRepository.findAll();
        List<InventoryItem> lowStockList = allInventory.stream()
                .filter(i -> i.getStatus() == StockStatus.LOW_STOCK || i.getStatus() == StockStatus.OUT_OF_STOCK ||
                        (i.getQuantity() != null && i.getMinThreshold() != null && i.getQuantity() <= i.getMinThreshold()))
                .toList();

        int lowStockCount = lowStockList.size();
        String lowStockNames = lowStockList.stream()
                .map(InventoryItem::getName)
                .limit(3)
                .collect(Collectors.joining(", "));
        if (lowStockNames.isBlank()) {
            lowStockNames = "None (All ingredients in stock)";
        }

        // 5. Kitchen Queue Bottlenecks
        long activeOrdersCount = orderRepository.countByOrderStatusIn(List.of(OrderStatus.PENDING, OrderStatus.PREPARING));

        // Try AI generation if configured
        RestaurantPulseResponse pulse = null;
        if (aiClient.isConfigured()) {
            try {
                pulse = generateAiPulseAnalytics(cleanPeriod, periodLabel, totalRevenue, totalOrders, aov,
                        topItem, topQty, leastItem, peakHour, slowHour, lowStockCount, lowStockNames, (int) activeOrdersCount);
            } catch (Exception e) {
                log.warn("AI Restaurant Pulse generation failed; falling back to deterministic pulse: {}", e.getMessage());
            }
        }

        if (pulse == null || pulse.getInsights() == null || pulse.getInsights().isEmpty()) {
            pulse = buildDeterministicPulseFallback(cleanPeriod, periodLabel, totalRevenue, totalOrders, aov,
                    topItem, topQty, leastItem, peakHour, slowHour, lowStockCount, lowStockNames, (int) activeOrdersCount);
        }

        // Populate Infographic visual models
        try {
            pulse.setCategoryBreakdown(analyticsService.getCategorySales());
            pulse.setTopPerformingDishes(analyticsService.getTopDishes(6));
            pulse.setHourlyDistribution(analyticsService.getHourlyDemand());
            com.sizzle.backend.dto.AnalyticsOverviewResponse overview = analyticsService.getOverview();
            if (overview != null && overview.getDailyTrends() != null) {
                pulse.setRevenueTrends(overview.getDailyTrends());
            }
        } catch (Exception e) {
            log.warn("Could not attach infographic analytics to pulse: {}", e.getMessage());
        }

        return pulse;
    }

    private RestaurantPulseResponse generateAiPulseAnalytics(String cleanPeriod, String periodLabel,
                                                              BigDecimal totalRevenue, long totalOrders, BigDecimal aov,
                                                              String topItem, long topQty, String leastItem,
                                                              String peakHour, String slowHour,
                                                              int lowStockCount, String lowStockNames, int activeOrders) {
        String metricsContext = String.format(
                "Time Window: %s\n" +
                "Total Revenue: ₹%s\n" +
                "Total Valid Orders: %d\n" +
                "Average Order Value (AOV): ₹%s\n" +
                "Top-Selling Item: %s (%d units sold)\n" +
                "Underperforming Menu Dish: %s\n" +
                "Peak Traffic Hours: %s\n" +
                "Slow Traffic Hours: %s\n" +
                "Low-Stock/Depleted Ingredients: %d items (%s)\n" +
                "Active Kitchen Orders In Queue: %d",
                periodLabel, totalRevenue.toPlainString(), totalOrders, aov.toPlainString(),
                topItem, topQty, leastItem, peakHour, slowHour, lowStockCount, lowStockNames, activeOrders
        );

        String prompt = "You are an executive restaurant operations consultant. Evaluate these verified operational metrics for Sizzle Restaurant:\n\n" +
                metricsContext + "\n\n" +
                "Requirements:\n" +
                "1. summary: A 2-3 sentence executive pulse overview evaluating restaurant performance and operational pace.\n" +
                "2. insights: Exactly 3 or 4 key insights. Each insight MUST have: 'title', 'severity' (one of 'POSITIVE', 'WARNING', 'INFO'), 'description' (interpret the business trend or operational bottleneck), and 'evidence' (cite the factual verified metrics).\n" +
                "3. recommendations: Exactly 3 or 4 practical, actionable operational recommendations for management or the head chef.\n" +
                "4. Output strictly a JSON object conforming to: {\"summary\": \"...\", \"insights\": [{\"title\": \"...\", \"severity\": \"...\", \"description\": \"...\", \"evidence\": \"...\"}], \"recommendations\": [\"...\"]}.\n" +
                "CRITICAL: Do NOT invent numbers, revenue figures, or dishes. Interpret only the provided verified facts.";

        AIRequest req = AIRequest.builder()
                .prompt(prompt)
                .systemInstruction("You are Sizzle Intelligence, an executive restaurant pulse analyzer for Sizzle Restaurant. " +
                        "Output strictly valid JSON. Do not mention external AI models, providers, or technical jargon.")
                .temperature(0.3)
                .jsonMode(true)
                .build();

        AIResponse res = aiClient.execute(req);
        if (res == null || res.isFallback() || res.getStructuredData() == null) {
            return null;
        }

        return parseAiPulseResponse(res.getStructuredData(), cleanPeriod, totalRevenue, totalOrders, aov,
                topItem, topQty, leastItem, peakHour, slowHour, lowStockCount, "AI");
    }

    private RestaurantPulseResponse parseAiPulseResponse(Object structuredData, String period,
                                                          BigDecimal totalRevenue, long totalOrders, BigDecimal aov,
                                                          String topItem, long topQty, String leastItem,
                                                          String peakHour, String slowHour, int lowStockCount,
                                                          String source) {
        if (!(structuredData instanceof Map<?, ?> dataMap)) {
            return null;
        }

        String summary = (dataMap.get("summary") != null) ? dataMap.get("summary").toString().trim() : "";
        List<PulseInsight> insights = new ArrayList<>();

        Object rawInsights = dataMap.get("insights");
        if (rawInsights instanceof List<?> list) {
            for (Object o : list) {
                if (!(o instanceof Map<?, ?> map)) continue;
                String title = (map.get("title") != null) ? map.get("title").toString() : "Operational Insight";
                String sev = (map.get("severity") != null) ? map.get("severity").toString().toUpperCase() : "INFO";
                if (!List.of("POSITIVE", "WARNING", "INFO").contains(sev)) sev = "INFO";
                String desc = (map.get("description") != null) ? map.get("description").toString() : "";
                String ev = (map.get("evidence") != null) ? map.get("evidence").toString() : "";

                insights.add(PulseInsight.builder()
                        .title(title)
                        .severity(sev)
                        .description(desc)
                        .evidence(ev)
                        .build());
            }
        }

        List<String> recs = new ArrayList<>();
        Object rawRecs = dataMap.get("recommendations");
        if (rawRecs instanceof List<?> rList) {
            for (Object r : rList) {
                if (r != null && !r.toString().isBlank()) {
                    recs.add(r.toString().trim());
                }
            }
        }

        if (insights.isEmpty() || summary.isBlank()) {
            return null;
        }

        return RestaurantPulseResponse.builder()
                .period(period)
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .averageOrderValue(aov)
                .topItem(topItem)
                .topItemQuantity(topQty)
                .leastPerformingItem(leastItem)
                .peakHour(peakHour)
                .slowHour(slowHour)
                .lowStockItemsCount(lowStockCount)
                .summary(summary)
                .insights(insights)
                .recommendations(recs)
                .source(source)
                .build();
    }

    private RestaurantPulseResponse buildDeterministicPulseFallback(String cleanPeriod, String periodLabel,
                                                                     BigDecimal totalRevenue, long totalOrders, BigDecimal aov,
                                                                     String topItem, long topQty, String leastItem,
                                                                     String peakHour, String slowHour, int lowStockCount,
                                                                     String lowStockNames, int activeOrders) {
        String summary = String.format(
                "Sizzle generated ₹%s across %d verified orders during %s, maintaining an average order value of ₹%s. " +
                "%s remains your primary revenue anchor, while service volume peaks during %s.",
                totalRevenue.toPlainString(), totalOrders, periodLabel.toLowerCase(), aov.toPlainString(),
                topItem, peakHour
        );

        List<PulseInsight> insights = new ArrayList<>();

        // Insight 1: Sales Driver
        insights.add(PulseInsight.builder()
                .title("Signature Dish Dominance")
                .severity("POSITIVE")
                .description(String.format("%s is driving consistent guest demand and anchors repeat order revenue.", topItem))
                .evidence(String.format("%d units sold, contributing significantly to ₹%s in %s revenue.", topQty, totalRevenue.toPlainString(), periodLabel.toLowerCase()))
                .build());

        // Insight 2: Peak Hours
        insights.add(PulseInsight.builder()
                .title("Evening Service Concentration")
                .severity("INFO")
                .description(String.format("Guest orders surge during %s, requiring dedicated station prep and expedited dispatch.", peakHour))
                .evidence(String.format("Highest order volume recorded during %s compared to slower pace during %s.", peakHour, slowHour))
                .build());

        // Insight 3: Inventory or Kitchen Bottleneck
        if (lowStockCount > 0) {
            insights.add(PulseInsight.builder()
                    .title("Critical Inventory Threshold Alert")
                    .severity("WARNING")
                    .description(String.format("Stock levels for %d ingredients are depleted or below minimum buffer threshold.", lowStockCount))
                    .evidence(String.format("Restock required for: %s to prevent kitchen stockouts.", lowStockNames))
                    .build());
        } else if (activeOrders > 2) {
            insights.add(PulseInsight.builder()
                    .title("Kitchen Queue Load")
                    .severity("WARNING")
                    .description("Active order volume in kitchen is elevated, potentially extending order preparation times.")
                    .evidence(String.format("%d orders currently in PENDING or PREPARING queue.", activeOrders))
                    .build());
        } else {
            insights.add(PulseInsight.builder()
                    .title("Kitchen Preparation Efficiency")
                    .severity("POSITIVE")
                    .description("Kitchen workload is operating smoothly with minimal queue friction and prompt preparation.")
                    .evidence(String.format("%d active orders currently in preparation queue.", activeOrders))
                    .build());
        }

        // Insight 4: Menu Opportunity
        insights.add(PulseInsight.builder()
                .title("Underperforming Dish Opportunity")
                .severity("INFO")
                .description(String.format("%s has lagged behind peer dishes in the %s window.", leastItem, periodLabel.toLowerCase()))
                .evidence(String.format("Lowest relative sales volume across available menu categories during %s.", periodLabel.toLowerCase()))
                .build());

        List<String> recommendations = List.of(
                String.format("Pre-portion and prepare ingredients for %s ahead of the %s rush.", topItem, peakHour),
                (lowStockCount > 0
                        ? String.format("Submit immediate purchase orders for depleted ingredients: %s.", lowStockNames)
                        : "Maintain automated stock thresholds for high-velocity burger and biryani ingredients."),
                String.format("Bundle %s into an executive lunch combo or feature it with a limited-time 15%% pairing incentive.", leastItem),
                String.format("Optimize kitchen station scheduling during %s to prepare prep mise-en-place for peak dining.", slowHour)
        );

        return RestaurantPulseResponse.builder()
                .period(cleanPeriod)
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .averageOrderValue(aov)
                .topItem(topItem)
                .topItemQuantity(topQty)
                .leastPerformingItem(leastItem)
                .peakHour(peakHour)
                .slowHour(slowHour)
                .lowStockItemsCount(lowStockCount)
                .summary(summary)
                .insights(insights)
                .recommendations(recommendations)
                .source("DETERMINISTIC_FALLBACK")
                .build();
    }

    // =========================================================================
    // FEATURE 4: RESTAURANT WHAT-IF COPILOT
    // =========================================================================

    @Override
    public WhatIfResponse simulateScenario(WhatIfRequest request) {
        if (request == null || request.getQuery() == null || request.getQuery().trim().isEmpty()) {
            throw new IllegalArgumentException("Query string is required for What-If scenario simulation.");
        }

        String rawQuery = request.getQuery().trim();
        String qLower = rawQuery.toLowerCase();
        log.info("Simulating What-If scenario for query: '{}'", rawQuery);

        List<MenuItem> allMenuItems = menuItemRepository.findAll();
        List<Order> allOrders = orderRepository.findAllByOrderByCreatedAtDesc();
        List<Order> completedOrders = allOrders.stream()
                .filter(o -> o.getOrderStatus() == OrderStatus.DELIVERED
                        || o.getOrderStatus() == OrderStatus.PREPARING
                        || o.getOrderStatus() == OrderStatus.PENDING)
                .collect(Collectors.toList());

        String scenarioType = determineScenarioType(qLower, request);

        WhatIfResponse response;
        switch (scenarioType) {
            case "DISCOUNT":
                response = simulateDiscountScenario(rawQuery, qLower, request, allMenuItems, completedOrders);
                break;
            case "VOLUME_INCREASE":
                response = simulateVolumeIncreaseScenario(rawQuery, qLower, request, completedOrders);
                break;
            case "MENU_REMOVAL":
                response = simulateMenuRemovalScenario(rawQuery, qLower, request, allMenuItems, completedOrders);
                break;
            case "PROMOTION_RECOMMENDATION":
                response = simulatePromotionScenario(rawQuery, qLower, request, allMenuItems, completedOrders);
                break;
            case "NEW_ITEM_INTRODUCTION":
                response = simulateNewItemScenario(rawQuery, qLower, request, allMenuItems, completedOrders);
                break;
            default:
                response = simulateGeneralScenario(rawQuery, qLower, request, completedOrders);
                break;
        }

        if (aiClient.isConfigured()) {
            enhanceWithAI(response, rawQuery);
        }

        return response;
    }

    private String determineScenarioType(String qLower, WhatIfRequest request) {
        if (request.getScenarioType() != null && ("NEW_ITEM".equalsIgnoreCase(request.getScenarioType()) || "NEW_ITEM_INTRODUCTION".equalsIgnoreCase(request.getScenarioType()))) {
            return "NEW_ITEM_INTRODUCTION";
        }
        if (qLower.contains("add a new") || qLower.contains("add new") || qLower.contains("new item") ||
                qLower.contains("new dish") || qLower.contains("introduce new") || qLower.contains("introduce a new") ||
                qLower.contains("launch new") || qLower.contains("launch a new") || qLower.contains("add item") ||
                qLower.contains("add a dish") || qLower.contains("create new item") ||
                qLower.contains("start serving a new") || qLower.contains("bring a new") ||
                (qLower.contains("what if i add") && !qLower.contains("discount") && !qLower.contains("price"))) {
            return "NEW_ITEM_INTRODUCTION";
        }
        if (request.getDiscountPercentage() != null ||
                qLower.contains("discount") || qLower.contains("% off") || qLower.contains("price drop") ||
                qLower.contains("reduce price") || qLower.contains("cheaper") || qLower.contains("lower price")) {
            return "DISCOUNT";
        }
        if (request.getVolumeIncreasePercentage() != null ||
                qLower.contains("volume") || qLower.contains("orders increase") || qLower.contains("order increase") ||
                qLower.contains("traffic") || qLower.contains("rush") || qLower.contains("demand increase")) {
            return "VOLUME_INCREASE";
        }
        if (qLower.contains("remove") || qLower.contains("drop") || qLower.contains("discontinue") ||
                qLower.contains("delete") || qLower.contains("stop serving") || qLower.contains("take off")) {
            return "MENU_REMOVAL";
        }
        if (qLower.contains("promote") || qLower.contains("promotion") || qLower.contains("weekend") ||
                qLower.contains("feature") || qLower.contains("special") || qLower.contains("which item") ||
                qLower.contains("campaign")) {
            return "PROMOTION_RECOMMENDATION";
        }
        return "GENERAL";
    }

    private MenuItem findTargetMenuItem(String qLower, String explicitName, List<MenuItem> allMenuItems) {
        if (explicitName != null && !explicitName.trim().isEmpty()) {
            String target = explicitName.trim().toLowerCase();
            for (MenuItem item : allMenuItems) {
                if (item.getName().equalsIgnoreCase(target) || item.getName().toLowerCase().contains(target)) {
                    return item;
                }
            }
        }
        List<MenuItem> sorted = new ArrayList<>(allMenuItems);
        sorted.sort((a, b) -> Integer.compare(b.getName().length(), a.getName().length()));
        for (MenuItem item : sorted) {
            if (qLower.contains(item.getName().toLowerCase())) {
                return item;
            }
        }
        if (qLower.contains("biryani")) {
            return allMenuItems.stream().filter(m -> m.getName().toLowerCase().contains("chicken biryani")).findFirst()
                    .orElse(allMenuItems.stream().filter(m -> m.getName().toLowerCase().contains("biryani")).findFirst().orElse(null));
        }
        if (qLower.contains("pasta")) {
            return allMenuItems.stream().filter(m -> m.getName().toLowerCase().contains("pasta")).findFirst().orElse(null);
        }
        if (qLower.contains("pizza")) {
            return allMenuItems.stream().filter(m -> m.getName().toLowerCase().contains("margherita pizza")).findFirst()
                    .orElse(allMenuItems.stream().filter(m -> m.getName().toLowerCase().contains("pizza")).findFirst().orElse(null));
        }
        if (qLower.contains("burger")) {
            return allMenuItems.stream().filter(m -> m.getName().toLowerCase().contains("chicken burger")).findFirst()
                    .orElse(allMenuItems.stream().filter(m -> m.getName().toLowerCase().contains("classic burger")).findFirst().orElse(null));
        }
        if (qLower.contains("chicken")) {
            return allMenuItems.stream().filter(m -> m.getName().toLowerCase().contains("chicken biryani")).findFirst()
                    .orElse(allMenuItems.stream().filter(m -> m.getName().toLowerCase().contains("chicken")).findFirst().orElse(null));
        }
        return null;
    }

    private Double extractPercentage(String text, Double explicitValue, double defaultValue) {
        if (explicitValue != null && explicitValue > 0) {
            return explicitValue;
        }
        Pattern pattern = Pattern.compile("(\\d+(?:\\.\\d+)?)\\s*%");
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            try {
                return Double.parseDouble(matcher.group(1));
            } catch (Exception ignored) {}
        }
        Pattern wordPattern = Pattern.compile("(\\d+(?:\\.\\d+)?)\\s*percent");
        Matcher wordMatcher = wordPattern.matcher(text);
        if (wordMatcher.find()) {
            try {
                return Double.parseDouble(wordMatcher.group(1));
            } catch (Exception ignored) {}
        }
        return defaultValue;
    }

    private long calculateHistoricalItemSales(MenuItem item, List<Order> completedOrders) {
        long qty = 0;
        for (Order o : completedOrders) {
            if (o.getItems() != null) {
                for (OrderItem oi : o.getItems()) {
                    if ((oi.getMenuItem() != null && oi.getMenuItem().getId().equals(item.getId()))
                            || (oi.getItemName() != null && oi.getItemName().equalsIgnoreCase(item.getName()))) {
                        qty += oi.getQuantity();
                    }
                }
            }
        }
        return (qty > 0) ? qty : 25L;
    }

    private WhatIfResponse simulateDiscountScenario(String rawQuery, String qLower, WhatIfRequest request,
                                                    List<MenuItem> allMenuItems, List<Order> completedOrders) {
        MenuItem targetItem = findTargetMenuItem(qLower, request.getMenuItemName(), allMenuItems);
        if (targetItem == null) {
            targetItem = allMenuItems.stream().filter(m -> m.getName().equalsIgnoreCase("Chicken Biryani")).findFirst()
                    .orElse(allMenuItems.isEmpty() ? null : allMenuItems.get(0));
        }

        String itemName = (targetItem != null) ? targetItem.getName() : "Selected Dish";
        BigDecimal currentPrice = (targetItem != null) ? targetItem.getPrice() : BigDecimal.valueOf(250.0);

        double discountPct = extractPercentage(rawQuery, request.getDiscountPercentage(), 10.0);
        if (discountPct > 80.0) discountPct = 80.0;
        if (discountPct < 1.0) discountPct = 5.0;

        long currentOrders = (targetItem != null) ? calculateHistoricalItemSales(targetItem, completedOrders) : 25L;
        BigDecimal currentRevenue = currentPrice.multiply(BigDecimal.valueOf(currentOrders)).setScale(2, RoundingMode.HALF_UP);

        double demandLiftPct = discountPct * 1.5;
        long projectedOrders = Math.round(currentOrders * (1.0 + demandLiftPct / 100.0));
        BigDecimal discountedPrice = currentPrice.multiply(BigDecimal.valueOf(1.0 - (discountPct / 100.0))).setScale(2, RoundingMode.HALF_UP);
        BigDecimal projectedRevenue = discountedPrice.multiply(BigDecimal.valueOf(projectedOrders)).setScale(2, RoundingMode.HALF_UP);

        BigDecimal revDelta = projectedRevenue.subtract(currentRevenue);
        long ordersDelta = projectedOrders - currentOrders;
        double revDeltaPct = (currentRevenue.compareTo(BigDecimal.ZERO) > 0)
                ? (revDelta.doubleValue() / currentRevenue.doubleValue()) * 100.0 : 0.0;

        List<String> assumptions = List.of(
                String.format("Price Elasticity of Demand: Assumed at -1.5, indicating a %.0f%% price discount stimulates a +%.1f%% volume increase.", discountPct, demandLiftPct),
                "Cost Structure: Ingredient food cost per plate is assumed constant, meaning incremental volume is necessary to compensate for margin compression.",
                "Kitchen Capacity: Line cooks and prep stations have sufficient throughput to handle the additional unit orders without prep SLA breaches."
        );

        String revDeltaSign = (revDelta.compareTo(BigDecimal.ZERO) >= 0) ? "+" : "";

        WhatIfImpact impact = WhatIfImpact.builder()
                .revenue(String.format("%s₹%,.0f (%s%.1f%%)", revDeltaSign, revDelta.abs(), revDeltaSign, revDeltaPct))
                .orders(String.format("+%d orders (+%.1f%%)", ordersDelta, demandLiftPct))
                .risk(discountPct > 20.0
                        ? "High Margin Risk — A heavy discount severely compresses per-unit contribution margins. Kitchen line will experience rush friction."
                        : "Moderate Risk — Unit contribution margin drops slightly. Ensure cross-selling of beverages and appetizers to maintain basket profitability.")
                .build();

        String recommendation = String.format(
                "A %.0f%% discount on %s is projected to boost order volume from %d to %d units (+%.1f%%), resulting in projected revenue of ₹%,.0f (%s₹%,.0f net change). " +
                        "To maximize profitability, bundle this promotion with high-margin sides (e.g., beverages or starters) and schedule the campaign during off-peak or lunch hours.",
                discountPct, itemName, currentOrders, projectedOrders, demandLiftPct, projectedRevenue, revDeltaSign, revDelta.abs()
        );

        return WhatIfResponse.builder()
                .scenario(String.format("%.0f%% Discount on %s", discountPct, itemName))
                .scenarioType("DISCOUNT")
                .assumptions(assumptions)
                .currentState(WhatIfState.builder()
                        .label(String.format("Baseline (%s)", itemName))
                        .orders(currentOrders)
                        .revenue(currentRevenue)
                        .averagePrice(currentPrice)
                        .build())
                .projectedState(WhatIfState.builder()
                        .label(String.format("Projected (%.0f%% Discount)", discountPct))
                        .orders(projectedOrders)
                        .revenue(projectedRevenue)
                        .averagePrice(discountedPrice)
                        .build())
                .impact(impact)
                .recommendation(recommendation)
                .source("DETERMINISTIC_FALLBACK")
                .build();
    }

    private WhatIfResponse simulateVolumeIncreaseScenario(String rawQuery, String qLower, WhatIfRequest request,
                                                          List<Order> completedOrders) {
        double volumePct = extractPercentage(rawQuery, request.getVolumeIncreasePercentage(), 20.0);
        if (volumePct < 1.0) volumePct = 10.0;
        if (volumePct > 300.0) volumePct = 100.0;

        long currentOrders = completedOrders.isEmpty() ? 50L : completedOrders.size();
        BigDecimal currentRevenue = completedOrders.stream()
                .map(Order::getGrandTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (currentRevenue.compareTo(BigDecimal.ZERO) == 0) {
            currentRevenue = BigDecimal.valueOf(17500.0);
        }

        BigDecimal aov = currentRevenue.divide(BigDecimal.valueOf(currentOrders), 2, RoundingMode.HALF_UP);

        long projectedOrders = Math.round(currentOrders * (1.0 + volumePct / 100.0));
        BigDecimal projectedRevenue = aov.multiply(BigDecimal.valueOf(projectedOrders)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal revDelta = projectedRevenue.subtract(currentRevenue);
        long ordersDelta = projectedOrders - currentOrders;

        List<String> assumptions = List.of(
                String.format("Demand Distribution: Order volume increases evenly across all active categories by +%.0f%%.", volumePct),
                String.format("Basket Value Stability: Average Order Value (AOV) is assumed constant at ₹%.0f per ticket.", aov),
                "Operational Scalability: Peak kitchen staffing and prep mise-en-place can absorb the ticket surge without exceeding preparation SLAs."
        );

        WhatIfImpact impact = WhatIfImpact.builder()
                .revenue(String.format("+₹%,.0f (+%.1f%%)", revDelta, volumePct))
                .orders(String.format("+%d orders (+%.1f%%)", ordersDelta, volumePct))
                .risk(volumePct >= 25.0
                        ? "Elevated Operational Risk — A surge of this magnitude will overwhelm cooking stations during peak 7–9 PM hours unless additional prep mise-en-place is staged."
                        : "Low to Moderate Risk — Manageable increase within standard kitchen capacity; ensure adequate stock of high-velocity ingredients.")
                .build();

        String recommendation = String.format(
                "A +%.0f%% increase in overall order volume elevates ticket count from %d to %d orders, driving estimated gross revenue to ₹%,.0f (+₹%,.0f net gain). " +
                        "To fulfill this surge without ticket delays, pre-portion chicken, rice, and burger patties before the 7:00 PM dinner rush and verify that delivery packaging is fully stocked.",
                volumePct, currentOrders, projectedOrders, projectedRevenue, revDelta
        );

        return WhatIfResponse.builder()
                .scenario(String.format("+%.0f%% Order Volume Increase", volumePct))
                .scenarioType("VOLUME_INCREASE")
                .assumptions(assumptions)
                .currentState(WhatIfState.builder()
                        .label("Current Order Baseline")
                        .orders(currentOrders)
                        .revenue(currentRevenue)
                        .averagePrice(aov)
                        .build())
                .projectedState(WhatIfState.builder()
                        .label(String.format("Projected (+%.0f%% Volume)", volumePct))
                        .orders(projectedOrders)
                        .revenue(projectedRevenue)
                        .averagePrice(aov)
                        .build())
                .impact(impact)
                .recommendation(recommendation)
                .source("DETERMINISTIC_FALLBACK")
                .build();
    }

    private WhatIfResponse simulateMenuRemovalScenario(String rawQuery, String qLower, WhatIfRequest request,
                                                       List<MenuItem> allMenuItems, List<Order> completedOrders) {
        MenuItem targetItem = findTargetMenuItem(qLower, request.getMenuItemName(), allMenuItems);
        if (targetItem == null) {
            targetItem = allMenuItems.stream().filter(m -> m.getName().toLowerCase().contains("pasta")).findFirst()
                    .orElse(allMenuItems.isEmpty() ? null : allMenuItems.get(0));
        }

        String itemName = (targetItem != null) ? targetItem.getName() : "Selected Dish";
        BigDecimal currentPrice = (targetItem != null) ? targetItem.getPrice() : BigDecimal.valueOf(210.0);
        long currentOrders = (targetItem != null) ? calculateHistoricalItemSales(targetItem, completedOrders) : 18L;
        BigDecimal currentRevenue = currentPrice.multiply(BigDecimal.valueOf(currentOrders)).setScale(2, RoundingMode.HALF_UP);

        double subRate = 0.65;
        long lostOrders = Math.round(currentOrders * (1.0 - subRate));
        long retainedOrders = currentOrders - lostOrders;
        BigDecimal retainedRevenue = currentRevenue.multiply(BigDecimal.valueOf(subRate)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal netRevLoss = currentRevenue.subtract(retainedRevenue);

        List<String> assumptions = List.of(
                "Customer Substitution Rate: 65% of diners seeking this dish will substitute with an alternative item in the same category.",
                "Net Demand Churn: 35% of orders will be lost entirely due to strict dietary preference or lack of interest in substitutes.",
                "Kitchen Efficiency Gain: Eliminates recipe-specific ingredients, freeing up prep station line space and reducing perishables waste."
        );

        WhatIfImpact impact = WhatIfImpact.builder()
                .revenue(String.format("-₹%,.0f (-35.0%%)", netRevLoss))
                .orders(String.format("-%d lost orders (-35.0%%)", lostOrders))
                .risk("Low Risk — Retained revenue is 65% through category substitution. Kitchen complexity and perishable spoilage will be noticeably reduced.")
                .build();

        String recommendation = String.format(
                "Removing %s from the active menu will result in an estimated direct net revenue reduction of ₹%,.0f across %d churned orders. " +
                        "However, 65%% of demand (%d orders, ₹%,.0f) is expected to substitute into peer menu offerings. " +
                        "This change is strategically advantageous if the dish suffers from high ingredient spoilage or station prep bottlenecks.",
                itemName, netRevLoss, lostOrders, retainedOrders, retainedRevenue
        );

        return WhatIfResponse.builder()
                .scenario(String.format("Remove %s from Menu", itemName))
                .scenarioType("MENU_REMOVAL")
                .assumptions(assumptions)
                .currentState(WhatIfState.builder()
                        .label(String.format("Current Sales (%s)", itemName))
                        .orders(currentOrders)
                        .revenue(currentRevenue)
                        .averagePrice(currentPrice)
                        .build())
                .projectedState(WhatIfState.builder()
                        .label("Projected Substitution (65% Retained)")
                        .orders(retainedOrders)
                        .revenue(retainedRevenue)
                        .averagePrice(currentPrice)
                        .build())
                .impact(impact)
                .recommendation(recommendation)
                .source("DETERMINISTIC_FALLBACK")
                .build();
    }

    private WhatIfResponse simulatePromotionScenario(String rawQuery, String qLower, WhatIfRequest request,
                                                     List<MenuItem> allMenuItems, List<Order> completedOrders) {
        MenuItem targetItem = findTargetMenuItem(qLower, request.getMenuItemName(), allMenuItems);
        if (targetItem == null) {
            targetItem = allMenuItems.stream().filter(m -> m.getName().equalsIgnoreCase("Chicken Biryani")).findFirst()
                    .orElse(allMenuItems.isEmpty() ? null : allMenuItems.get(0));
        }

        String itemName = (targetItem != null) ? targetItem.getName() : "Hero Item";
        BigDecimal currentPrice = (targetItem != null) ? targetItem.getPrice() : BigDecimal.valueOf(260.0);
        long currentOrders = (targetItem != null) ? calculateHistoricalItemSales(targetItem, completedOrders) : 30L;
        BigDecimal currentRevenue = currentPrice.multiply(BigDecimal.valueOf(currentOrders)).setScale(2, RoundingMode.HALF_UP);

        double liftPct = 25.0;
        long projectedOrders = Math.round(currentOrders * (1.0 + liftPct / 100.0));
        BigDecimal crossSellPrice = currentPrice.multiply(BigDecimal.valueOf(1.08)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal projectedRevenue = crossSellPrice.multiply(BigDecimal.valueOf(projectedOrders)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal revDelta = projectedRevenue.subtract(currentRevenue);
        long ordersDelta = projectedOrders - currentOrders;
        double revDeltaPct = (revDelta.doubleValue() / currentRevenue.doubleValue()) * 100.0;

        List<String> assumptions = List.of(
                "Weekend Promotion Surge: Featured placement delivers an estimated +25% lift in hero dish unit orders.",
                "Cross-Selling Attachment: 30% of customers ordering the featured dish add high-margin beverages or starters.",
                "Prime Time Concentration: Promotion effectiveness is highest during the Friday–Sunday 7:00 PM – 9:30 PM dining window."
        );

        WhatIfImpact impact = WhatIfImpact.builder()
                .revenue(String.format("+₹%,.0f (+%.1f%%)", revDelta, revDeltaPct))
                .orders(String.format("+%d orders (+%.1f%%)", ordersDelta, liftPct))
                .risk("Moderate Risk — Peak cooking stations (e.g. Biryani Dum or Tandoor) will face higher concurrent ticket load. Stage prep mise-en-place prior to 7 PM.")
                .build();

        String recommendation = String.format(
                "Promoting %s for the upcoming weekend is highly recommended. It is projected to yield %d orders (+%d orders) and ₹%,.0f in gross sales (+₹%,.0f net gain). " +
                        "Action items: Pre-cook and stage base portions before 6:30 PM, and configure an automatic prompt offering cold beverages or garlic naan at checkout.",
                itemName, projectedOrders, ordersDelta, projectedRevenue, revDelta
        );

        return WhatIfResponse.builder()
                .scenario(String.format("Weekend Promotion for %s", itemName))
                .scenarioType("PROMOTION_RECOMMENDATION")
                .assumptions(assumptions)
                .currentState(WhatIfState.builder()
                        .label(String.format("Baseline (%s)", itemName))
                        .orders(currentOrders)
                        .revenue(currentRevenue)
                        .averagePrice(currentPrice)
                        .build())
                .projectedState(WhatIfState.builder()
                        .label(String.format("Projected Promo (%s)", itemName))
                        .orders(projectedOrders)
                        .revenue(projectedRevenue)
                        .averagePrice(crossSellPrice)
                        .build())
                .impact(impact)
                .recommendation(recommendation)
                .source("DETERMINISTIC_FALLBACK")
                .build();
    }

    
    private WhatIfResponse simulateNewItemScenario(String rawQuery, String qLower, WhatIfRequest request,
                                                  List<MenuItem> allMenuItems, List<Order> completedOrders) {
        String dishName = extractNewDishName(rawQuery, request.getMenuItemName());

        BigDecimal targetPrice;
        if (request.getNewItemPrice() != null && request.getNewItemPrice().compareTo(BigDecimal.ZERO) > 0) {
            targetPrice = request.getNewItemPrice().setScale(2, RoundingMode.HALF_UP);
        } else {
            Double queryPrice = extractPriceFromQuery(qLower);
            if (queryPrice != null && queryPrice > 0) {
                targetPrice = BigDecimal.valueOf(queryPrice).setScale(2, RoundingMode.HALF_UP);
            } else if (allMenuItems != null && !allMenuItems.isEmpty()) {
                BigDecimal sum = allMenuItems.stream()
                        .map(MenuItem::getPrice)
                        .filter(Objects::nonNull)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                targetPrice = sum.divide(BigDecimal.valueOf(allMenuItems.size()), 2, RoundingMode.HALF_UP);
            } else {
                targetPrice = BigDecimal.valueOf(250.00);
            }
        }

        // 1. Current State is STRICTLY ZERO (It is an unreleased new item!)
        long currentOrders = 0L;
        BigDecimal currentRevenue = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        // 2. Model Projected Trial Adoption based on restaurant footfall
        long totalHistoricalOrders = (completedOrders != null && !completedOrders.isEmpty()) ? completedOrders.size() : 25L;
        // Projected trial rate: ~20% of dining patrons try a new featured menu item
        long projectedOrders = Math.max(5L, Math.round(totalHistoricalOrders * 0.20));
        BigDecimal projectedRevenue = targetPrice.multiply(BigDecimal.valueOf(projectedOrders)).setScale(2, RoundingMode.HALF_UP);

        List<String> assumptions = List.of(
                "Zero Historical Baseline: This item is brand new to the menu; baseline orders and historical revenue are strictly 0.",
                "Guest Trial Adoption: Projected trial rate assumes 15%–20% of dining patrons sample the new offering during initial rollout.",
                "Category Cannibalization: Approximately 30%–35% of orders are estimated to substitute from existing menu items rather than purely additive visits.",
                "Kitchen Station Line Fit: Assumes ingredients can be integrated into current prep stations without extending ticket preparation times beyond standard SLAs."
        );

        WhatIfImpact impact = WhatIfImpact.builder()
                .revenue(String.format("+₹%,.0f (New Item Launch Revenue)", projectedRevenue))
                .orders(String.format("+%d orders (Initial Trial Volume)", projectedOrders))
                .risk("Operational Risk: Low demand elasticity or inventory over-ordering may cause spoilage of specialty ingredients. Stage a 2-week pilot with limited daily batches.")
                .build();

        String recommendation = String.format(
                "Introducing %s at ₹%,.2f is projected to generate ₹%,.0f across %d initial trial orders. " +
                "Since this item has zero historical orders, we recommend launching it as a 'Chef's Limited Special' for 2 weeks. " +
                "Monitor reorder frequency, guest sentiment, and food-cost margins before permanently integrating it into the core catalog.",
                dishName, targetPrice, projectedRevenue, projectedOrders
        );

        return WhatIfResponse.builder()
                .scenario(String.format("Add %s to Menu", dishName))
                .scenarioType("NEW_ITEM_INTRODUCTION")
                .assumptions(assumptions)
                .currentState(WhatIfState.builder()
                        .label(String.format("Pre-Launch Baseline (%s)", dishName))
                        .orders(currentOrders)
                        .revenue(currentRevenue)
                        .averagePrice(targetPrice)
                        .build())
                .projectedState(WhatIfState.builder()
                        .label(String.format("Projected Launch Trial (%s)", dishName))
                        .orders(projectedOrders)
                        .revenue(projectedRevenue)
                        .averagePrice(targetPrice)
                        .build())
                .impact(impact)
                .recommendation(recommendation)
                .source("DETERMINISTIC_FALLBACK")
                .build();
    }

    private String extractNewDishName(String rawQuery, String explicitName) {
        if (explicitName != null && !explicitName.trim().isEmpty()) {
            return explicitName.trim();
        }
        String clean = rawQuery.trim().replaceAll("[?.,!]", "").trim();
        String lower = clean.toLowerCase();

        String[] prefixes = {
                "what if i add a new item in menu",
                "what if i add a new item on menu",
                "what if i add a new item to menu",
                "what if i add a new item",
                "what if we add a new item",
                "what if i add new item",
                "what if we add new item",
                "what if i add a new dish",
                "what if we add a new dish",
                "what if i introduce a new item",
                "what if we introduce a new item",
                "what if i launch a new item",
                "what if we launch a new item",
                "what if i add",
                "what if we add",
                "what if i introduce",
                "what if we introduce",
                "what if i launch",
                "what if we launch",
                "what happens if i add",
                "what happens if we add"
        };

        for (String p : prefixes) {
            if (lower.startsWith(p)) {
                String remainder = clean.substring(p.length()).trim();
                remainder = remainder.replaceAll("(?i)\\b(to the menu|in the menu|on the menu|to menu|in menu|on menu)\\b", "").trim();
                if (!remainder.isEmpty() && !remainder.equalsIgnoreCase("a new item") && !remainder.equalsIgnoreCase("new item") && !remainder.equalsIgnoreCase("a new dish") && !remainder.equalsIgnoreCase("new dish")) {
                    return capitalizeWords(remainder);
                }
            }
        }
        return "New Menu Item";
    }

    private Double extractPriceFromQuery(String qLower) {
        java.util.regex.Pattern p = java.util.regex.Pattern.compile("(?:price|at|for|₹|rs\\.?)\\s*([0-9]+(?:\\.[0-9]+)?)");
        java.util.regex.Matcher m = p.matcher(qLower);
        if (m.find()) {
            try {
                return Double.parseDouble(m.group(1));
            } catch (Exception ignored) {}
        }
        return null;
    }

    private String capitalizeWords(String str) {
        if (str == null || str.isEmpty()) return str;
        String[] words = str.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String w : words) {
            if (!w.isEmpty()) {
                sb.append(Character.toUpperCase(w.charAt(0)));
                if (w.length() > 1) {
                    sb.append(w.substring(1).toLowerCase());
                }
                sb.append(" ");
            }
        }
        return sb.toString().trim();
    }

    private WhatIfResponse simulateGeneralScenario(String rawQuery, String qLower, WhatIfRequest request,
                                                   List<Order> completedOrders) {
        long currentOrders = completedOrders.isEmpty() ? 50L : completedOrders.size();
        BigDecimal currentRevenue = completedOrders.stream()
                .map(Order::getGrandTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (currentRevenue.compareTo(BigDecimal.ZERO) == 0) {
            currentRevenue = BigDecimal.valueOf(17500.0);
        }
        BigDecimal aov = currentRevenue.divide(BigDecimal.valueOf(currentOrders), 2, RoundingMode.HALF_UP);

        long projectedOrders = Math.round(currentOrders * 1.10);
        BigDecimal projectedRevenue = aov.multiply(BigDecimal.valueOf(projectedOrders)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal revDelta = projectedRevenue.subtract(currentRevenue);
        long ordersDelta = projectedOrders - currentOrders;

        List<String> assumptions = List.of(
                "Operational Sensitivity: Assumes a baseline ±10% variation in customer dining frequency.",
                "Average Spend Consistency: Current customer order basket size and ticket value remain stable.",
                "Service SLA Retention: Kitchen order preparation times remain within the standard 15–20 minute window."
        );

        WhatIfImpact impact = WhatIfImpact.builder()
                .revenue(String.format("+₹%,.0f (+10.0%%)", revDelta))
                .orders(String.format("+%d orders (+10.0%%)", ordersDelta))
                .risk("Low Risk — Operational adjustments within this margin are easily supported by current kitchen line capacity.")
                .build();

        String recommendation = String.format(
                "Based on historical dining actuals, a 10%% positive swing translates to %d total orders and ₹%,.0f in revenue (+₹%,.0f net gain). " +
                        "Evaluate menu engineering, staff station assignments, and automated upselling to capture this opportunity.",
                projectedOrders, projectedRevenue, revDelta
        );

        return WhatIfResponse.builder()
                .scenario(rawQuery)
                .scenarioType("GENERAL")
                .assumptions(assumptions)
                .currentState(WhatIfState.builder()
                        .label("Current Operational Baseline")
                        .orders(currentOrders)
                        .revenue(currentRevenue)
                        .averagePrice(aov)
                        .build())
                .projectedState(WhatIfState.builder()
                        .label("Projected Scenario Baseline")
                        .orders(projectedOrders)
                        .revenue(projectedRevenue)
                        .averagePrice(aov)
                        .build())
                .impact(impact)
                .recommendation(recommendation)
                .source("DETERMINISTIC_FALLBACK")
                .build();
    }

    private void enhanceWithAI(WhatIfResponse response, String rawQuery) {
        try {
            String assumptionsJoined = String.join("\n- ", response.getAssumptions());
            String prompt = String.format(
                    "You are Sizzle Intelligence What-If Copilot, an AI decision-support assistant for restaurant managers.\n" +
                            "A restaurant manager has asked the following business question:\n\"%s\"\n\n" +
                            "We have already calculated the deterministic numerical actuals and projections using real Sizzle database data:\n" +
                            "- Scenario: %s\n" +
                            "- Scenario Type: %s\n" +
                            "- Current Actuals: %d orders, ₹%s revenue, ₹%s avg price\n" +
                            "- Stated Assumptions:\n- %s\n" +
                            "- Projected Estimates: %d orders, ₹%s revenue, ₹%s avg price\n" +
                            "- Net Impact: Revenue %s, Orders %s\n\n" +
                            "CRITICAL RULES:\n" +
                            "1. You MUST NOT modify or fabricate numbers or stated assumptions.\n" +
                            "2. You are a simulator for decision support; you must never execute live orders or change menu prices.\n" +
                            "3. IMPORTANT FOR NEW_ITEM_INTRODUCTION: This item is brand new / unreleased, so historical baseline orders and revenue are strictly 0. Do NOT invent or claim that the new item had past orders. Focus on customer trial rate, kitchen station prep, and inventory spoilage risk.\n" +
                            "4. Provide strategic executive interpretation, operational risk assessment (kitchen bottlenecks, stockouts, margin squeeze), and concrete manager recommendations.\n\n" +
                            "Return ONLY a strictly valid JSON object with this exact structure:\n" +
                            "{\n" +
                            "  \"recommendation\": \"Concise executive analysis and actionable operational advice for the manager...\",\n" +
                            "  \"risk\": \"Operational and financial risks (e.g. kitchen line prep bottlenecks, inventory stockout, margin compression)...\"\n" +
                            "}",
                    rawQuery,
                    response.getScenario(),
                    response.getScenarioType(),
                    response.getCurrentState().getOrders(),
                    response.getCurrentState().getRevenue(),
                    response.getCurrentState().getAveragePrice(),
                    assumptionsJoined,
                    response.getProjectedState().getOrders(),
                    response.getProjectedState().getRevenue(),
                    response.getProjectedState().getAveragePrice(),
                    response.getImpact().getRevenue(),
                    response.getImpact().getOrders()
            );

            AIRequest aiRequest = AIRequest.builder()
                    .systemInstruction("You are Sizzle Intelligence What-If Copilot. Return strictly valid JSON containing recommendation and risk.")
                    .prompt(prompt)
                    .jsonMode(true)
                    .temperature(0.3)
                    .build();

            AIResponse aiResp = aiClient.execute(aiRequest);
            if (aiResp != null && aiResp.getText() != null && !aiResp.getText().trim().isEmpty()) {
                String content = aiResp.getText().trim();
                if (content.startsWith("```json")) {
                    content = content.substring(7);
                } else if (content.startsWith("```")) {
                    content = content.substring(3);
                }
                if (content.endsWith("```")) {
                    content = content.substring(0, content.length() - 3);
                }
                content = content.trim();

                Map<String, Object> map = objectMapper.readValue(content, new TypeReference<Map<String, Object>>() {});
                if (map != null) {
                    if (map.containsKey("recommendation") && map.get("recommendation") != null) {
                        response.setRecommendation(map.get("recommendation").toString());
                    }
                    if (map.containsKey("risk") && map.get("risk") != null) {
                        response.getImpact().setRisk(map.get("risk").toString());
                    }
                    response.setSource("AI");
                }
            }
        } catch (Exception e) {
            log.warn("AI enhancement for What-If scenario simulation failed. Retaining deterministic fallback. Reason: {}", e.getMessage());
        }
    }
}
