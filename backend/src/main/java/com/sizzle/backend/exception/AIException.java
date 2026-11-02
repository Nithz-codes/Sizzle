package com.sizzle.backend.exception;

public class AIException extends RuntimeException {

    private final boolean isTransient;
    private final String fallbackMessage;

    public AIException(String message) {
        super(message);
        this.isTransient = false;
        this.fallbackMessage = "Sizzle Intelligence service is temporarily unavailable. Please try again later.";
    }

    public AIException(String message, Throwable cause) {
        super(message, cause);
        this.isTransient = true;
        this.fallbackMessage = "Sizzle Intelligence service is temporarily unavailable. Please try again later.";
    }

    public AIException(String message, String fallbackMessage, boolean isTransient) {
        super(message);
        this.fallbackMessage = fallbackMessage != null ? fallbackMessage : "Sizzle Intelligence fallback mode active.";
        this.isTransient = isTransient;
    }

    public AIException(String message, Throwable cause, String fallbackMessage, boolean isTransient) {
        super(message, cause);
        this.fallbackMessage = fallbackMessage != null ? fallbackMessage : "Sizzle Intelligence fallback mode active.";
        this.isTransient = isTransient;
    }

    public boolean isTransient() {
        return isTransient;
    }

    public String getFallbackMessage() {
        return fallbackMessage;
    }
}

