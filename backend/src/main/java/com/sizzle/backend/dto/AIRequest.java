package com.sizzle.backend.dto;

import java.util.Map;

public class AIRequest {

    private String prompt;
    private String systemInstruction;
    private Double temperature;
    private boolean jsonMode = true;
    private Map<String, Object> contextData;

    public AIRequest() {}

    public AIRequest(String prompt) {
        this.prompt = prompt;
    }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getSystemInstruction() { return systemInstruction; }
    public void setSystemInstruction(String systemInstruction) { this.systemInstruction = systemInstruction; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public boolean isJsonMode() { return jsonMode; }
    public void setJsonMode(boolean jsonMode) { this.jsonMode = jsonMode; }

    public Map<String, Object> getContextData() { return contextData; }
    public void setContextData(Map<String, Object> contextData) { this.contextData = contextData; }

    public static AIRequestBuilder builder() {
        return new AIRequestBuilder();
    }

    public static class AIRequestBuilder {
        private String prompt;
        private String systemInstruction;
        private Double temperature;
        private boolean jsonMode = true;
        private Map<String, Object> contextData;

        public AIRequestBuilder prompt(String prompt) { this.prompt = prompt; return this; }
        public AIRequestBuilder systemInstruction(String systemInstruction) { this.systemInstruction = systemInstruction; return this; }
        public AIRequestBuilder temperature(Double temperature) { this.temperature = temperature; return this; }
        public AIRequestBuilder jsonMode(boolean jsonMode) { this.jsonMode = jsonMode; return this; }
        public AIRequestBuilder contextData(Map<String, Object> contextData) { this.contextData = contextData; return this; }

        public AIRequest build() {
            AIRequest request = new AIRequest();
            request.setPrompt(this.prompt);
            request.setSystemInstruction(this.systemInstruction);
            request.setTemperature(this.temperature);
            request.setJsonMode(this.jsonMode);
            request.setContextData(this.contextData);
            return request;
        }
    }
}

