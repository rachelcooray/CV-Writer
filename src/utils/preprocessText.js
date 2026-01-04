export const preprocessText = (text, type = 'cv') => {
    if (!text) return '';

    let cleaned = text
        .replace(/\s+/g, ' ') // Collapse whitespace
        .trim();

    if (type === 'cv') {
        // Keep reasonable length, focus on Skills, Experience, Education
        // For now, we'll just trim to ~8000 chars as a guardrail
        cleaned = cleaned.substring(0, 10000);
    } else if (type === 'jd') {
        // Basic JD cleaning: Remove very common boilerplate if needed
        // But mostly we want to preserve the context for the AI
        cleaned = cleaned.substring(0, 5000);
    }

    return cleaned;
};
