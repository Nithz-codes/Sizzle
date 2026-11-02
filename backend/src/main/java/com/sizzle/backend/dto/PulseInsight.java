package com.sizzle.backend.dto;

public class PulseInsight {

    private String title;
    private String severity; // "INFO", "WARNING", "POSITIVE"
    private String description;
    private String evidence;

    public PulseInsight() {}

    public PulseInsight(String title, String severity, String description, String evidence) {
        this.title = title;
        this.severity = severity;
        this.description = description;
        this.evidence = evidence;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEvidence() { return evidence; }
    public void setEvidence(String evidence) { this.evidence = evidence; }

    public static class Builder {
        private String title;
        private String severity;
        private String description;
        private String evidence;

        public Builder title(String title) { this.title = title; return this; }
        public Builder severity(String severity) { this.severity = severity; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder evidence(String evidence) { this.evidence = evidence; return this; }

        public PulseInsight build() {
            return new PulseInsight(title, severity, description, evidence);
        }
    }
}

