package com.sizzle.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sizzle.backend.dto.AIRequest;
import com.sizzle.backend.dto.AIResponse;
import com.sizzle.backend.dto.MealOptimizationRequest;
import com.sizzle.backend.dto.MealOptimizationResponse;
import com.sizzle.backend.dto.WaitTimeResponse;
import com.sizzle.backend.dto.RestaurantPulseResponse;
import com.sizzle.backend.dto.WhatIfRequest;
import com.sizzle.backend.dto.WhatIfResponse;
import com.sizzle.backend.model.InventoryItem;
import com.sizzle.backend.model.Order;
import com.sizzle.backend.model.OrderItem;
import com.sizzle.backend.model.StockStatus;
import com.sizzle.backend.repository.InventoryRepository;
import java.time.LocalDateTime;
import static org.mockito.ArgumentMatchers.any;
import com.sizzle.backend.exception.AIException;
import com.sizzle.backend.exception.ResourceNotFoundException;
import com.sizzle.backend.model.Category;
import com.sizzle.backend.model.MenuItem;
import com.sizzle.backend.repository.MenuItemRepository;
import com.sizzle.backend.repository.OrderRepository;
import com.sizzle.backend.service.impl.AIClientImpl;
import com.sizzle.backend.service.impl.AIServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

class SizzleIntelligenceTest {

        private ObjectMapper objectMapper;
        private AIClientImpl aiClient;
        private MenuItemRepository menuItemRepository;
        private OrderRepository orderRepository;
        private InventoryRepository inventoryRepository;
        private AIServiceImpl aiService;

        @BeforeEach
        void setUp() {
                objectMapper = new ObjectMapper();
                aiClient = new AIClientImpl(objectMapper);
                ReflectionTestUtils.setField(aiClient, "configuredApiKey", "DISABLED");
                ReflectionTestUtils.setField(aiClient, "timeoutMs", 15000L);
                aiClient.init();
                menuItemRepository = Mockito.mock(MenuItemRepository.class);
                orderRepository = Mockito.mock(OrderRepository.class);
                inventoryRepository = Mockito.mock(InventoryRepository.class);
                aiService = new AIServiceImpl(aiClient, menuItemRepository, orderRepository, inventoryRepository,
                                objectMapper);
        }

        @Test
        @DisplayName("Verify fallback when API key is not configured")
        void testFallbackWhenUnconfigured() {
                ReflectionTestUtils.setField(aiClient, "configuredApiKey", "DISABLED");
                ReflectionTestUtils.setField(aiClient, "configuredModel", "gemini-2.5-flash");
                ReflectionTestUtils.setField(aiClient, "timeoutMs", 15000L);
                aiClient.init();

                assertFalse(aiClient.isConfigured(), "AIClient should report not configured when key is empty");

                AIResponse response = aiService.executeTestPrompt("Hello Sizzle");
                assertNotNull(response);
                assertEquals("FALLBACK", response.getStatus());
                assertTrue(response.isFallback());
                assertNotNull(response.getStructuredData());

                Map<?, ?> data = (Map<?, ?>) response.getStructuredData();
                assertEquals("Sizzle Intelligence", data.get("product"));
                assertEquals("READY_OFFLINE", data.get("status"));
        }

        @Test
        @DisplayName("Verify isConfigured returns true when a valid key is provided")
        void testIsConfiguredWithValidKey() {
                ReflectionTestUtils.setField(aiClient, "configuredApiKey", "AIzaSyTestKey1234567890abcdef");
                aiClient.init();
                assertTrue(aiClient.isConfigured(), "AIClient should report configured with valid key");
        }

        @Test
        @DisplayName("Verify credential read from property/environment")
        void testCredentialReadFromProperty() {
                ReflectionTestUtils.setField(aiClient, "configuredApiKey", "dummy-test-key-12345");
                ReflectionTestUtils.setField(aiClient, "configuredModel", "gemini-2.5-flash");
                ReflectionTestUtils.setField(aiClient, "timeoutMs", 15000L);
                aiClient.init();

                assertTrue(aiClient.isConfigured(), "AIClient should report configured when key is set");
        }

        @Test
        @DisplayName("Verify AIRequest validation rejects empty prompt")
        void testEmptyPromptValidation() {
                ReflectionTestUtils.setField(aiClient, "configuredApiKey", "dummy-test-key-12345");
                ReflectionTestUtils.setField(aiClient, "configuredModel", "gemini-2.5-flash");
                ReflectionTestUtils.setField(aiClient, "timeoutMs", 15000L);
                aiClient.init();

                AIRequest emptyReq = AIRequest.builder().prompt("").build();
                assertThrows(AIException.class, () -> aiClient.execute(emptyReq));
        }

        @Test
        @DisplayName("Feature 1: Wait-Time Advisor deterministic calculation for Biryani with active kitchen queue")
        void testWaitTimeAdvisorCalculation() {
                ReflectionTestUtils.setField(aiClient, "configuredApiKey", "DISABLED");
                aiClient.init();

                Category biryaniCat = Category.builder().name("Biryani").displayName("Biryani").build();
                MenuItem biryani = MenuItem.builder()
                                .id(101L)
                                .name("Hyderabadi Chicken Biryani")
                                .prepTime("18-20 mins")
                                .category(biryaniCat)
                                .price(new BigDecimal("320.00"))
                                .build();

                when(menuItemRepository.findById(101L)).thenReturn(Optional.of(biryani));
                // Mock 3 active orders in kitchen
                when(orderRepository.countByOrderStatusIn(anyList())).thenReturn(3L);

                WaitTimeResponse response = aiService.getWaitTimeEstimate(101L);

                assertNotNull(response);
                assertEquals(101L, response.getMenuItemId());
                // Base prep time = 20 mins (upper bound of 18-20)
                assertEquals(20, response.getBaseMinutes());
                // Complexity for Biryani = +4 mins
                assertEquals(4, response.getComplexityMinutes());
                // Queue load for 3 active orders = 6 + (3 - 2) * 3 = 9 mins
                assertEquals(9, response.getQueueLoadMinutes());
                // Total = 20 + 4 + 9 = 33 mins
                assertEquals(33, response.getEstimatedMinutes());
                assertEquals("MODERATE", response.getKitchenStatus());
                assertEquals("MEDIUM", response.getConfidence());
                assertTrue(response.getGeneratedExplanation().contains("33 minutes"));
                assertTrue(response.getReason().contains("Base preparation: 20 min"));
        }

        @Test
        @DisplayName("Feature 1: Wait-Time Advisor handles unknown item with 404 ResourceNotFoundException")
        void testWaitTimeUnknownItem() {
                when(menuItemRepository.findById(999L)).thenReturn(Optional.empty());

                assertThrows(ResourceNotFoundException.class, () -> aiService.getWaitTimeEstimate(999L));
        }

        @Test
        @DisplayName("Feature 1: Cart Wait-Time Advisor calculates slowest dish + multi-item buffer")
        void testCartWaitTimeAdvisor() {
                ReflectionTestUtils.setField(aiClient, "configuredApiKey", "DISABLED");
                aiClient.init();

                Category burgerCat = Category.builder().name("Burger").displayName("Burger").build();
                MenuItem burger = MenuItem.builder()
                                .id(1L)
                                .name("Classic Burger")
                                .prepTime("12 mins")
                                .category(burgerCat)
                                .build();

                Category grillCat = Category.builder().name("Grill").displayName("Grill").build();
                MenuItem tandoori = MenuItem.builder()
                                .id(2L)
                                .name("Tandoori Chicken Full")
                                .prepTime("25 mins")
                                .category(grillCat)
                                .build();

                when(menuItemRepository.findAllById(List.of(1L, 2L))).thenReturn(List.of(burger, tandoori));
                when(orderRepository.countByOrderStatusIn(anyList())).thenReturn(0L); // 0 active orders

                WaitTimeResponse cartResponse = aiService.getCartWaitTimeEstimate(List.of(1L, 2L));

                assertNotNull(cartResponse);
                // Max base = 25 mins (Tandoori)
                assertEquals(25, cartResponse.getBaseMinutes());
                // Queue load for 0 orders = 0 mins
                assertEquals(0, cartResponse.getQueueLoadMinutes());
                // Complexity: max(2, 4) = 4 + multi-dish buffer (2-1)*2 = 2 => 6 mins
                assertEquals(6, cartResponse.getComplexityMinutes());
                // Total = 25 + 0 + 6 = 31 mins
                assertEquals(31, cartResponse.getEstimatedMinutes());
                assertEquals("LIGHT", cartResponse.getKitchenStatus());
                assertEquals("HIGH", cartResponse.getConfidence());
        }

        @Test
        @DisplayName("Feature 2: Meal Optimizer curates balanced basket within budget honoring mixed dietary requirements")
        void testMealOptimizationWithinBudgetAndDietaryConstraints() {
                ReflectionTestUtils.setField(aiClient, "configuredApiKey", "DISABLED");
                aiClient.init();

                Category biryaniCat = Category.builder().name("Biryani").displayName("Biryani").build();
                Category starterCat = Category.builder().name("Starters").displayName("Starters").build();

                MenuItem vegBiryani = MenuItem.builder()
                                .id(22L).name("Veg Biryani").price(new BigDecimal("180.00")).isVeg(true)
                                .isAvailable(true)
                                .category(biryaniCat).prepTime("18 mins").rating(4.6).build();

                MenuItem chickenBiryani = MenuItem.builder()
                                .id(23L).name("Chicken Biryani").price(new BigDecimal("260.00")).isVeg(false)
                                .isAvailable(true)
                                .category(biryaniCat).prepTime("20 mins").rating(4.9).build();

                MenuItem frenchFries = MenuItem.builder()
                                .id(41L).name("French Fries").price(new BigDecimal("90.00")).isVeg(true)
                                .isAvailable(true)
                                .category(starterCat).prepTime("10 mins").rating(4.5).build();

                when(menuItemRepository.findByIsAvailableTrue())
                                .thenReturn(List.of(vegBiryani, chickenBiryani, frenchFries));
                when(menuItemRepository.findAllById(anyList())).thenAnswer(inv -> {
                        List<Long> ids = inv.getArgument(0);
                        return List.of(vegBiryani, chickenBiryani, frenchFries).stream()
                                        .filter(m -> ids.contains(m.getId())).toList();
                });
                when(orderRepository.countByOrderStatusIn(anyList())).thenReturn(1L);

                MealOptimizationRequest request = MealOptimizationRequest.builder()
                                .peopleCount(2)
                                .maxBudget(new BigDecimal("600.00"))
                                .dietaryPreference("MIXED_ONE_VEG")
                                .spicyPreference("ANY")
                                .build();

                MealOptimizationResponse response = aiService.optimizeMeal(request);

                assertNotNull(response);
                assertFalse(response.getItems().isEmpty(), "Basket should contain recommended items");
                assertTrue(response.getTotalPrice().compareTo(new BigDecimal("600.00")) <= 0,
                                "Total price must not exceed budget");
                assertEquals(new BigDecimal("600.00").subtract(response.getTotalPrice()),
                                response.getBudgetRemaining());

                // Verify mixed requirement: at least one veg and one non-veg
                boolean hasVeg = response.getItems().stream().anyMatch(i -> Boolean.TRUE.equals(i.getIsVeg()));
                boolean hasNonVeg = response.getItems().stream().anyMatch(i -> !Boolean.TRUE.equals(i.getIsVeg()));
                assertTrue(hasVeg, "Basket must contain at least one vegetarian dish");
                assertTrue(hasNonVeg, "Basket must contain at least one non-vegetarian dish");
                assertTrue(response.getEstimatedPreparationMinutes() > 0, "Preparation time must be calculated");
        }

        @Test
        @DisplayName("Feature 2: Meal Optimizer enforces strict VEG_ONLY preference")
        void testMealOptimizationVegOnlyStrictEnforcement() {
                ReflectionTestUtils.setField(aiClient, "configuredApiKey", "DISABLED");
                aiClient.init();

                Category burgerCat = Category.builder().name("Burger").displayName("Burger").build();
                MenuItem vegBurger = MenuItem.builder()
                                .id(1L).name("Veg Burger").price(new BigDecimal("120.00")).isVeg(true).isAvailable(true)
                                .category(burgerCat).prepTime("12 mins").rating(4.5).build();

                MenuItem chickenBurger = MenuItem.builder()
                                .id(2L).name("Chicken Burger").price(new BigDecimal("180.00")).isVeg(false)
                                .isAvailable(true)
                                .category(burgerCat).prepTime("15 mins").rating(4.7).build();

                when(menuItemRepository.findByIsAvailableTrue()).thenReturn(List.of(vegBurger, chickenBurger));
                when(menuItemRepository.findAllById(anyList())).thenReturn(List.of(vegBurger));
                when(orderRepository.countByOrderStatusIn(anyList())).thenReturn(0L);

                MealOptimizationRequest request = MealOptimizationRequest.builder()
                                .peopleCount(1)
                                .maxBudget(new BigDecimal("300.00"))
                                .dietaryPreference("VEG_ONLY")
                                .build();

                MealOptimizationResponse response = aiService.optimizeMeal(request);

                assertNotNull(response);
                assertFalse(response.getItems().isEmpty());
                assertTrue(response.getItems().stream().allMatch(i -> Boolean.TRUE.equals(i.getIsVeg())),
                                "All items in VEG_ONLY basket must be vegetarian");
        }

        @Test
        @DisplayName("Feature 2: Meal Optimizer handles budget below minimum threshold gracefully")
        void testMealOptimizationLowBudgetHandling() {
                MealOptimizationRequest request = MealOptimizationRequest.builder()
                                .maxBudget(new BigDecimal("25.00"))
                                .build();

                MealOptimizationResponse response = aiService.optimizeMeal(request);

                assertNotNull(response);
                assertTrue(response.getItems().isEmpty(), "No items should be returned for budget below threshold");
                assertEquals(BigDecimal.ZERO, response.getTotalPrice());
                assertTrue(response.getSummary().contains("budget"));
        }

        @Test
        @DisplayName("Feature 3: Restaurant Pulse evaluates verified financial, hourly, dish, and stock metrics")
        void testRestaurantPulseAnalyticsCalculation() {
                ReflectionTestUtils.setField(aiClient, "configuredApiKey", "DISABLED");
                aiClient.init();

                Category biryaniCat = Category.builder().name("Biryani").displayName("Biryani").build();
                MenuItem biryani = MenuItem.builder().id(23L).name("Chicken Biryani").price(new BigDecimal("260.00"))
                                .category(biryaniCat).build();

                OrderItem item1 = OrderItem.builder().itemName("Chicken Biryani").price(new BigDecimal("260.00"))
                                .quantity(3).subtotal(new BigDecimal("780.00")).build();
                Order order1 = Order.builder()
                                .id(1L)
                                .orderNumber("SZ-101")
                                .grandTotal(new BigDecimal("819.00"))
                                .orderStatus(com.sizzle.backend.model.OrderStatus.DELIVERED)
                                .createdAt(LocalDateTime.now().minusDays(1).withHour(19))
                                .build();
                order1.addItem(item1);

                OrderItem item2 = OrderItem.builder().itemName("Classic Burger").price(new BigDecimal("120.00"))
                                .quantity(1).subtotal(new BigDecimal("120.00")).build();
                Order order2 = Order.builder()
                                .id(2L)
                                .orderNumber("SZ-102")
                                .grandTotal(new BigDecimal("126.00"))
                                .orderStatus(com.sizzle.backend.model.OrderStatus.DELIVERED)
                                .createdAt(LocalDateTime.now().minusHours(3).withHour(20))
                                .build();
                order2.addItem(item2);

                when(orderRepository.findByCreatedAtAfterOrderByCreatedAtDesc(any()))
                                .thenReturn(List.of(order1, order2));
                when(menuItemRepository.findByIsAvailableTrue()).thenReturn(List.of(biryani));

                InventoryItem lowStockItem = InventoryItem.builder()
                                .id(1L)
                                .name("Fresh Farm Chicken Breast")
                                .quantity(8.0)
                                .minThreshold(12.0)
                                .status(StockStatus.LOW_STOCK)
                                .build();
                when(inventoryRepository.findAll()).thenReturn(List.of(lowStockItem));
                when(orderRepository.countByOrderStatusIn(anyList())).thenReturn(1L);

                RestaurantPulseResponse pulse = aiService.getRestaurantPulse("7days");

                assertNotNull(pulse);
                assertEquals("7days", pulse.getPeriod());
                assertEquals(2L, pulse.getTotalOrders());
                assertEquals(new BigDecimal("945.00"), pulse.getTotalRevenue());
                assertEquals(new BigDecimal("472.50"), pulse.getAverageOrderValue());
                assertEquals("Chicken Biryani", pulse.getTopItem());
                assertEquals(3L, pulse.getTopItemQuantity());
                assertEquals(1, pulse.getLowStockItemsCount());
                assertNotNull(pulse.getSummary());
                assertFalse(pulse.getInsights().isEmpty());
                assertTrue(pulse.getInsights().stream().anyMatch(i -> "POSITIVE".equals(i.getSeverity())));
                assertTrue(pulse.getInsights().stream().anyMatch(i -> "WARNING".equals(i.getSeverity())));
                assertFalse(pulse.getRecommendations().isEmpty());
                assertEquals("DETERMINISTIC_FALLBACK", pulse.getSource());
        }

        @Test
        @DisplayName("Feature 4: Simulate Discount Scenario deterministically calculates revenue & volume lift")
        void simulateScenario_DiscountCalculation_Success() {
                MenuItem biryani = MenuItem.builder()
                                .id(1L)
                                .name("Chicken Biryani")
                                .price(new BigDecimal("260.00"))
                                .isAvailable(true)
                                .build();
                when(menuItemRepository.findAll()).thenReturn(List.of(biryani));

                Order order = Order.builder()
                                .id(101L)
                                .orderNumber("ORD-001")
                                .grandTotal(new BigDecimal("520.00"))
                                .orderStatus(com.sizzle.backend.model.OrderStatus.DELIVERED)
                                .createdAt(LocalDateTime.now().minusDays(2))
                                .build();
                order.addItem(OrderItem.builder().menuItem(biryani).itemName("Chicken Biryani").quantity(2).price(new BigDecimal("260.00")).build());
                when(orderRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(order));

                WhatIfRequest request = WhatIfRequest.builder()
                                .query("What if I give 10% discount on Chicken Biryani?")
                                .build();

                WhatIfResponse response = aiService.simulateScenario(request);

                assertNotNull(response);
                assertEquals("DISCOUNT", response.getScenarioType());
                assertEquals("DETERMINISTIC_FALLBACK", response.getSource());
                assertEquals(2L, response.getCurrentState().getOrders());
                assertEquals(new BigDecimal("260.00"), response.getCurrentState().getAveragePrice());
                assertTrue(response.getProjectedState().getAveragePrice().compareTo(response.getCurrentState().getAveragePrice()) < 0);
                assertNotNull(response.getImpact());
                assertNotNull(response.getImpact().getRevenue());
                assertNotNull(response.getImpact().getOrders());
                assertNotNull(response.getImpact().getRisk());
                assertFalse(response.getAssumptions().isEmpty());
                assertTrue(response.getRecommendation().contains("Chicken Biryani"));
        }

        @Test
        @DisplayName("Feature 4: Simulate Volume Increase projects overall restaurant order load and revenue")
        void simulateScenario_VolumeIncrease_Success() {
                List<Order> tenOrders = new java.util.ArrayList<>();
                for (int i = 0; i < 10; i++) {
                        tenOrders.add(Order.builder().id((long) i).grandTotal(new BigDecimal("500.00")).orderStatus(com.sizzle.backend.model.OrderStatus.DELIVERED).build());
                }
                when(orderRepository.findAllByOrderByCreatedAtDesc()).thenReturn(tenOrders);

                WhatIfRequest request = WhatIfRequest.builder()
                                .query("What happens if order volume increases by 20%?")
                                .build();

                WhatIfResponse response = aiService.simulateScenario(request);

                assertNotNull(response);
                assertEquals("VOLUME_INCREASE", response.getScenarioType());
                assertEquals(10L, response.getCurrentState().getOrders());
                assertEquals(new BigDecimal("5000.00"), response.getCurrentState().getRevenue());
                assertEquals(new BigDecimal("500.00"), response.getCurrentState().getAveragePrice());
                assertNotNull(response.getProjectedState());
                assertEquals(12L, response.getProjectedState().getOrders());
                assertTrue(response.getProjectedState().getOrders() > response.getCurrentState().getOrders());
                assertTrue(response.getAssumptions().stream().anyMatch(a -> a.contains("Average Order Value")));
        }

        @Test
        @DisplayName("Feature 4: Simulate Menu Removal calculates customer substitution and net loss")
        void simulateScenario_MenuRemoval_Success() {
                MenuItem pasta = MenuItem.builder()
                                .id(12L)
                                .name("White Sauce Pasta")
                                .price(new BigDecimal("220.00"))
                                .isAvailable(true)
                                .build();
                when(menuItemRepository.findAll()).thenReturn(List.of(pasta));

                WhatIfRequest request = WhatIfRequest.builder()
                                .query("What if I remove Veg Pasta from the menu?")
                                .build();

                WhatIfResponse response = aiService.simulateScenario(request);

                assertNotNull(response);
                assertEquals("MENU_REMOVAL", response.getScenarioType());
                assertTrue(response.getAssumptions().stream().anyMatch(a -> a.contains("Substitution Rate")));
                assertNotNull(response.getImpact());
                assertTrue(response.getImpact().getRevenue().contains("-"));
        }

        @Test
        @DisplayName("Feature 4: Blank query throws IllegalArgumentException")
        void simulateScenario_BlankQuery_ThrowsException() {
                WhatIfRequest request = WhatIfRequest.builder().query("   ").build();
                assertThrows(IllegalArgumentException.class, () -> aiService.simulateScenario(request));
        }
}
