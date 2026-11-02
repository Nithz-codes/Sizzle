package com.sizzle.backend.dto;

import java.time.LocalDateTime;

public class AIResponse {

    private String status; // "SUCCESS", "FALLBACK", "ERROR"
    private String text;
    private Object structuredData;
    private boolean fallback;
    private String fallbackReason;
    private LocalDateTime timestamp = LocalDateTime.now();

    public AIResponse() {}

    public AIResponse(String status, String text, Object structuredData, boolean fallback, String fallbackReason) {
        this.status = status;
        this.text = text;
        this.structuredData = structuredData;
        this.fallback = fallback;
        this.fallbackReason = fallbackReason;
        this.timestamp = LocalDateTime.now();
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Object getStructuredData() { return structuredData; }
    public void setStructuredData(Object structuredData) { this.structuredData = structuredData; }

    public boolean isFallback() { return fallback; }
    public void setFallback(boolean fallback) { this.fallback = fallback; }

    public String getFallbackReason() { return fallbackReason; }
    public void setFallbackReason(String fallbackReason) { this.fallbackReason = fallbackReason; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public static AIResponse success(String text, Object structuredData) {
        return new AIResponse("SUCCESS", text, structuredData, false, null);
    }

    public static AIResponse fallback(String fallbackText, Object structuredData, String reason) {
        return new AIResponse("FALLBACK", fallbackText, structuredData, true, reason);
    }

    public static AIResponseBuilder builder() {
        return new AIResponseBuilder();
    }

    public static class AIResponseBuilder {
        private String status = "SUCCESS";
        private String text;
        private Object structuredData;
        private boolean fallback = false;
        private String fallbackReason;

        public AIResponseBuilder status(String status) { this.status = status; return this; }
        public AIResponseBuilder text(String text) { this.text = text; return this; }
        public AIResponseBuilder structuredData(Object structuredData) { this.structuredData = structuredData; return this; }
        public AIResponseBuilder fallback(boolean fallback) { this.fallback = fallback; return this; }
        public AIResponseBuilder fallbackReason(String fallbackReason) { this.fallbackReason = fallbackReason; return this; }

        public AIResponse build() {
            return new AIResponse(status, text, structuredData, fallback, fallbackReason);
        }
    }
}

