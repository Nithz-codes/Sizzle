package com.sizzle.backend.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.HttpOptions;
import com.google.genai.types.Part;
import com.sizzle.backend.dto.AIRequest;
import com.sizzle.backend.dto.AIResponse;
import com.sizzle.backend.exception.AIException;
import com.sizzle.backend.service.AIClient;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.*;

@Component
public class AIClientImpl implements AIClient {

    private static final Logger log = LoggerFactory.getLogger(AIClientImpl.class);

    private final ObjectMapper objectMapper;

    @Value("${sizzle.intelligence.api-key:${AI_API_KEY:${GEMINI_API_KEY:${GOOGLE_API_KEY:}}}}")
    private String configuredApiKey;

    @Value("${sizzle.intelligence.model:${AI_MODEL:gemini-3-flash-preview}}")
    private String configuredModel;

    @Value("${sizzle.intelligence.timeout-ms:${AI_TIMEOUT_MS:15000}}")
    private long timeoutMs;

    private Client client;
    private String resolvedApiKey;
    private final ExecutorService executorService = Executors.newCachedThreadPool();

    public AIClientImpl(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        refreshClient();
    }

    public synchronized void refreshClient() {
        this.resolvedApiKey = resolveApiKey();
        this.configuredModel = resolveModel();
        if (isConfigured()) {
            try {
                int effectiveTimeoutMs = (int) Math.min(3500, Math.max(1000, timeoutMs));
                HttpOptions httpOptions = HttpOptions.builder()
                        .timeout(effectiveTimeoutMs)
                        .build();

                this.client = Client.builder()
                        .apiKey(resolvedApiKey)
                        .httpOptions(httpOptions)
                        .build();

                log.info("Sizzle Intelligence AIClient initialized successfully with model: [{}], timeout: [{}ms], key: [{}]",
                        configuredModel, timeoutMs, maskSecret(resolvedApiKey));
            } catch (Exception e) {
                log.error("Failed to initialize Sizzle Intelligence client: {}", e.getMessage());
                this.client = null;
            }
        } else {
            log.warn("Sizzle Intelligence API key is not configured or is a placeholder. Fallback mode active.");
        }
    }

    @Override
    public boolean isConfigured() {
        if (resolvedApiKey == null || resolvedApiKey.isBlank() || !isValidKey(resolvedApiKey)) {
            this.resolvedApiKey = resolveApiKey();
        }
        return isValidKey(resolvedApiKey);
    }

    @Override
    public AIResponse execute(AIRequest request) {
        if (request == null || request.getPrompt() == null || request.getPrompt().isBlank()) {
            throw new AIException("AI request prompt cannot be empty.");
        }

        if (!isConfigured() || this.client == null) {
            refreshClient();
        }

        if (!isConfigured() || this.client == null) {
            log.warn("AI request rejected: AI provider is not configured. Serving sensible fallback.");
            return createFallbackResponse("Sizzle Intelligence is currently in offline fallback mode. AI credentials not configured.",
                    "API key missing or not configured");
        }

        Future<GenerateContentResponse> future = executorService.submit(() -> {
            GenerateContentConfig.Builder configBuilder = GenerateContentConfig.builder();

            if (request.getSystemInstruction() != null && !request.getSystemInstruction().isBlank()) {
                configBuilder.systemInstruction(Content.fromParts(Part.fromText(request.getSystemInstruction())));
            }

            if (request.getTemperature() != null) {
                configBuilder.temperature(request.getTemperature().floatValue());
            }

            if (request.isJsonMode()) {
                configBuilder.responseMimeType("application/json");
            }

            return client.models.generateContent(configuredModel, request.getPrompt(), configBuilder.build());
        });

        long waitTimeoutMs = Math.min(3500, Math.max(1000, timeoutMs));
        GenerateContentResponse response;
        try {
            response = future.get(waitTimeoutMs, TimeUnit.MILLISECONDS);
        } catch (TimeoutException e) {
            future.cancel(true);
            log.error("Sizzle Intelligence request timed out after {} ms", timeoutMs);
            throw new AIException("Sizzle Intelligence operation timed out after " + timeoutMs + " ms",
                    "Sizzle Intelligence request timed out. Please try again.", true);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Sizzle Intelligence execution interrupted: {}", e.getMessage());
            throw new AIException("Sizzle Intelligence operation was interrupted", e, "Operation was interrupted.", true);
        } catch (ExecutionException e) {
            Throwable cause = e.getCause() != null ? e.getCause() : e;
            log.error("Sizzle Intelligence provider call failed: {}", sanitizeErrorMessage(cause.getMessage()));
            throw new AIException("AI provider call failed: " + sanitizeErrorMessage(cause.getMessage()),
                    cause, "Sizzle Intelligence service is temporarily unavailable.", true);
        } catch (Exception e) {
            log.error("Unexpected error in Sizzle Intelligence execution: {}", sanitizeErrorMessage(e.getMessage()));
            throw new AIException("Unexpected AI execution error: " + sanitizeErrorMessage(e.getMessage()),
                    e, "Sizzle Intelligence encountered an unexpected error.", false);
        }

        if (response == null || response.text() == null || response.text().isBlank()) {
            log.warn("Received empty response from AI provider.");
            return createFallbackResponse("Received empty response from AI engine.", "Empty provider response");
        }

        String rawText = response.text().trim();
        Object structuredData = null;

        if (request.isJsonMode()) {
            String cleanJson = extractJsonPayload(rawText);
            try {
                structuredData = objectMapper.readValue(cleanJson, new TypeReference<Map<String, Object>>() {});
            } catch (Exception parseEx) {
                try {
                    structuredData = objectMapper.readValue(cleanJson, new TypeReference<List<Object>>() {});
                } catch (Exception listEx) {
                    log.warn("Failed to parse JSON response from AI provider. Raw text: {}", rawText);
                    structuredData = Collections.singletonMap("rawResponse", rawText);
                }
            }
        }

        return AIResponse.builder()
                .status("SUCCESS")
                .text(rawText)
                .structuredData(structuredData)
                .fallback(false)
                .build();
    }

    private boolean isValidKey(String key) {
        return key != null &&
                !key.isBlank() &&
                key.trim().startsWith("AIza") &&
                key.trim().length() > 20;
    }

    private List<Path> getCandidateEnvPaths() {
        List<Path> paths = new ArrayList<>();
        paths.add(Path.of(".env"));
        paths.add(Path.of("../.env"));
        paths.add(Path.of("../../.env"));
        String userDir = System.getProperty("user.dir");
        if (userDir != null && !userDir.isBlank()) {
            paths.add(Path.of(userDir, ".env"));
            paths.add(Path.of(userDir, "..", ".env"));
            paths.add(Path.of(userDir, "backend", ".env"));
        }
        paths.add(Path.of("d:/Sizzle/.env"));
        paths.add(Path.of("D:/Sizzle/.env"));
        return paths;
    }

    private Map<String, String> parseEnvFile(Path path) {
        Map<String, String> map = new HashMap<>();
        if (!Files.exists(path)) return map;
        try {
            List<String> lines = Files.readAllLines(path);
            for (String line : lines) {
                line = line.trim();
                if (line.startsWith("#") || line.isBlank()) continue;
                String[] parts = line.split("=", 2);
                if (parts.length == 2) {
                    String key = parts[0].trim();
                    String val = parts[1].trim().replaceAll("^\"|\"$|^'|'$", "").trim();
                    map.put(key, val);
                }
            }
        } catch (IOException ignored) {}
        return map;
    }

    private String resolveApiKey() {
        if ("DISABLED".equalsIgnoreCase(configuredApiKey)) {
            return "";
        }
        if (isValidKey(configuredApiKey)) {
            return configuredApiKey.trim();
        }

        for (String envName : List.of("AI_API_KEY", "GEMINI_API_KEY", "GOOGLE_API_KEY")) {
            String envVal = System.getenv(envName);
            if (isValidKey(envVal)) {
                return envVal.trim();
            }
        }

        for (String propName : List.of("sizzle.intelligence.api-key", "AI_API_KEY", "GEMINI_API_KEY")) {
            String propVal = System.getProperty(propName);
            if (isValidKey(propVal)) {
                return propVal.trim();
            }
        }

        for (Path path : getCandidateEnvPaths()) {
            Map<String, String> envMap = parseEnvFile(path);
            if (isValidKey(envMap.get("AI_API_KEY"))) {
                return envMap.get("AI_API_KEY");
            }
            if (isValidKey(envMap.get("GEMINI_API_KEY"))) {
                return envMap.get("GEMINI_API_KEY");
            }
            if (isValidKey(envMap.get("GOOGLE_API_KEY"))) {
                return envMap.get("GOOGLE_API_KEY");
            }
        }

        return "";
    }

    private String resolveModel() {
        for (Path path : getCandidateEnvPaths()) {
            Map<String, String> envMap = parseEnvFile(path);
            if (envMap.containsKey("AI_MODEL") && !envMap.get("AI_MODEL").isBlank()) {
                String m = envMap.get("AI_MODEL").trim();
                if (!"gemini-3.5-flash-lite".equalsIgnoreCase(m) && !"gemini-3.8-flash".equalsIgnoreCase(m)) {
                    return m;
                }
            }
        }
        if (configuredModel != null && !configuredModel.isBlank()) {
            if (!"gemini-3.5-flash-lite".equalsIgnoreCase(configuredModel) && !"gemini-3.8-flash".equalsIgnoreCase(configuredModel)) {
                return configuredModel.trim();
            }
        }
        return "gemini-3-flash-preview";
    }

    private String extractJsonPayload(String text) {
        if (text == null) return "{}";
        String trimmed = text.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        return trimmed.trim();
    }

    private AIResponse createFallbackResponse(String message, String reason) {
        Map<String, Object> fallbackPayload = new LinkedHashMap<>();
        fallbackPayload.put("engine", "Sizzle Intelligence (Fallback)");
        fallbackPayload.put("status", "FALLBACK_MODE");
        fallbackPayload.put("notice", message);

        return AIResponse.builder()
                .status("FALLBACK")
                .text(message)
                .structuredData(fallbackPayload)
                .fallback(true)
                .fallbackReason(reason)
                .build();
    }

    private String maskSecret(String secret) {
        if (secret == null || secret.isBlank()) return "[NONE]";
        if (secret.length() <= 8) return "***";
        return secret.substring(0, 4) + "..." + secret.substring(secret.length() - 4);
    }

    private String sanitizeErrorMessage(String error) {
        if (error == null) return "Unknown error";
        if (resolvedApiKey != null && !resolvedApiKey.isBlank() && error.contains(resolvedApiKey)) {
            return error.replace(resolvedApiKey, "[REDACTED_API_KEY]");
        }
        return error;
    }
}
