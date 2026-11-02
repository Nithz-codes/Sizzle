package com.sizzle.backend.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class WhatIfResponse {

    private String scenario;
    private String scenarioType; // "DISCOUNT", "VOLUME_INCREASE", "MENU_REMOVAL", "PROMOTION_RECOMMENDATION", "GENERAL"
    private List<String> assumptions = new ArrayList<>();
    private WhatIfState currentState;
    private WhatIfState projectedState;
    private WhatIfImpact impact;
    private String recommendation;
    private String source; // "AI" or "DETERMINISTIC_FALLBACK"
    private LocalDateTime generatedAt = LocalDateTime.now();

    public WhatIfResponse() {}

    public WhatIfResponse(String scenario, String scenarioType, List<String> assumptions,
                          WhatIfState currentState, WhatIfState projectedState,
                          WhatIfImpact impact, String recommendation, String source) {
        this.scenario = scenario;
        this.scenarioType = scenarioType;
        this.assumptions = (assumptions != null) ? assumptions : new ArrayList<>();
        this.currentState = currentState;
        this.projectedState = projectedState;
        this.impact = impact;
        this.recommendation = recommendation;
        this.source = source;
        this.generatedAt = LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getScenario() { return scenario; }
    public void setScenario(String scenario) { this.scenario = scenario; }

    public String getScenarioType() { return scenarioType; }
    public void setScenarioType(String scenarioType) { this.scenarioType = scenarioType; }

    public List<String> getAssumptions() { return assumptions; }
    public void setAssumptions(List<String> assumptions) { this.assumptions = assumptions; }

    public WhatIfState getCurrentState() { return currentState; }
    public void setCurrentState(WhatIfState currentState) { this.currentState = currentState; }

    public WhatIfState getProjectedState() { return projectedState; }
    public void setProjectedState(WhatIfState projectedState) { this.projectedState = projectedState; }

    public WhatIfImpact getImpact() { return impact; }
    public void setImpact(WhatIfImpact impact) { this.impact = impact; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }

    public static class Builder {
        private String scenario;
        private String scenarioType;
        private List<String> assumptions = new ArrayList<>();
        private WhatIfState currentState;
        private WhatIfState projectedState;
        private WhatIfImpact impact;
        private String recommendation;
        private String source;

        public Builder scenario(String scenario) { this.scenario = scenario; return this; }
        public Builder scenarioType(String scenarioType) { this.scenarioType = scenarioType; return this; }
        public Builder assumptions(List<String> assumptions) { this.assumptions = assumptions; return this; }
        public Builder currentState(WhatIfState currentState) { this.currentState = currentState; return this; }
        public Builder projectedState(WhatIfState projectedState) { this.projectedState = projectedState; return this; }
        public Builder impact(WhatIfImpact impact) { this.impact = impact; return this; }
        public Builder recommendation(String recommendation) { this.recommendation = recommendation; return this; }
        public Builder source(String source) { this.source = source; return this; }

        public WhatIfResponse build() {
            return new WhatIfResponse(scenario, scenarioType, assumptions, currentState,
                    projectedState, impact, recommendation, source);
        }
    }
}

