package com.sizzle.backend.service;

import com.sizzle.backend.dto.AIRequest;
import com.sizzle.backend.dto.AIResponse;

public interface AIClient {

    /**
     * Checks whether an AI API credential is configured and active.
     *
     * @return true if credentials are set, false otherwise
     */
    boolean isConfigured();

    /**
     * Executes a prompt request through the underlying AI provider.
     *
     * @param request the structured AI request
     * @return the structured AI response
     */
    AIResponse execute(AIRequest request);
}

