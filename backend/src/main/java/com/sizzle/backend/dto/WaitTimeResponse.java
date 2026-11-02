package com.sizzle.backend.dto;

import java.time.LocalDateTime;

public class WaitTimeResponse {

    private Long menuItemId;
    private String menuItemName;
    private int estimatedMinutes;
    private String confidence; // "HIGH", "MEDIUM", "LOW"
    private String kitchenStatus; // "LIGHT", "MODERATE", "BUSY"
    private int baseMinutes;
    private int queueLoadMinutes;
    private int complexityMinutes;
    private int activeKitchenOrders;
    private String reason;
    private String generatedExplanation;
    private LocalDateTime timestamp = LocalDateTime.now();

    public WaitTimeResponse() {}

    public WaitTimeResponse(Long menuItemId, String menuItemName, int estimatedMinutes, String confidence,
                            String kitchenStatus, int baseMinutes, int queueLoadMinutes, int complexityMinutes,
                            int activeKitchenOrders, String reason, String generatedExplanation) {
        this.menuItemId = menuItemId;
        this.menuItemName = menuItemName;
        this.estimatedMinutes = estimatedMinutes;
        this.confidence = confidence;
        this.kitchenStatus = kitchenStatus;
        this.baseMinutes = baseMinutes;
        this.queueLoadMinutes = queueLoadMinutes;
        this.complexityMinutes = complexityMinutes;
        this.activeKitchenOrders = activeKitchenOrders;
        this.reason = reason;
        this.generatedExplanation = generatedExplanation;
        this.timestamp = LocalDateTime.now();
    }

    public Long getMenuItemId() { return menuItemId; }
    public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }

    public String getMenuItemName() { return menuItemName; }
    public void setMenuItemName(String menuItemName) { this.menuItemName = menuItemName; }

    public int getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(int estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }

    public String getConfidence() { return confidence; }
    public void setConfidence(String confidence) { this.confidence = confidence; }

    public String getKitchenStatus() { return kitchenStatus; }
    public void setKitchenStatus(String kitchenStatus) { this.kitchenStatus = kitchenStatus; }

    public int getBaseMinutes() { return baseMinutes; }
    public void setBaseMinutes(int baseMinutes) { this.baseMinutes = baseMinutes; }

    public int getQueueLoadMinutes() { return queueLoadMinutes; }
    public void setQueueLoadMinutes(int queueLoadMinutes) { this.queueLoadMinutes = queueLoadMinutes; }

    public int getComplexityMinutes() { return complexityMinutes; }
    public void setComplexityMinutes(int complexityMinutes) { this.complexityMinutes = complexityMinutes; }

    public int getActiveKitchenOrders() { return activeKitchenOrders; }
    public void setActiveKitchenOrders(int activeKitchenOrders) { this.activeKitchenOrders = activeKitchenOrders; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getGeneratedExplanation() { return generatedExplanation; }
    public void setGeneratedExplanation(String generatedExplanation) { this.generatedExplanation = generatedExplanation; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public static WaitTimeResponseBuilder builder() {
        return new WaitTimeResponseBuilder();
    }

    public static class WaitTimeResponseBuilder {
        private Long menuItemId;
        private String menuItemName;
        private int estimatedMinutes;
        private String confidence;
        private String kitchenStatus;
        private int baseMinutes;
        private int queueLoadMinutes;
        private int complexityMinutes;
        private int activeKitchenOrders;
        private String reason;
        private String generatedExplanation;

        public WaitTimeResponseBuilder menuItemId(Long menuItemId) { this.menuItemId = menuItemId; return this; }
        public WaitTimeResponseBuilder menuItemName(String menuItemName) { this.menuItemName = menuItemName; return this; }
        public WaitTimeResponseBuilder estimatedMinutes(int estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; return this; }
        public WaitTimeResponseBuilder confidence(String confidence) { this.confidence = confidence; return this; }
        public WaitTimeResponseBuilder kitchenStatus(String kitchenStatus) { this.kitchenStatus = kitchenStatus; return this; }
        public WaitTimeResponseBuilder baseMinutes(int baseMinutes) { this.baseMinutes = baseMinutes; return this; }
        public WaitTimeResponseBuilder queueLoadMinutes(int queueLoadMinutes) { this.queueLoadMinutes = queueLoadMinutes; return this; }
        public WaitTimeResponseBuilder complexityMinutes(int complexityMinutes) { this.complexityMinutes = complexityMinutes; return this; }
        public WaitTimeResponseBuilder activeKitchenOrders(int activeKitchenOrders) { this.activeKitchenOrders = activeKitchenOrders; return this; }
        public WaitTimeResponseBuilder reason(String reason) { this.reason = reason; return this; }
        public WaitTimeResponseBuilder generatedExplanation(String generatedExplanation) { this.generatedExplanation = generatedExplanation; return this; }

        public WaitTimeResponse build() {
            return new WaitTimeResponse(menuItemId, menuItemName, estimatedMinutes, confidence, kitchenStatus,
                    baseMinutes, queueLoadMinutes, complexityMinutes, activeKitchenOrders, reason, generatedExplanation);
        }
    }
}

