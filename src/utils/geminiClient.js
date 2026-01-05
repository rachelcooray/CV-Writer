const callBackend = async (prompt, systemInstruction) => {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                modelName: "gemini-2.5-flash",
                systemInstruction,
                prompt
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Backend Call Failed:", error);
        throw error;
    }
};

export const analyzeCV = async (cvText, jobDescription) => {
    const systemInstruction = `You are a hiring manager and recruiter for this specific role. Today's date is ${new Date().toLocaleDateString()}. You are reviewing CVs quickly and deciding who to interview. You scan CVs quickly and reject weak ones without hesitation. Be strict, realistic, and specific. Your goal is to help this candidate improve enough to be interview-worthy. You MUST respond in valid JSON format.`;

    const prompt = `
JOB DESCRIPTION:
${jobDescription}

CANDIDATE CV:
${cvText}

INSTRUCTIONS:
Review this CV only in relation to this role. Feedback must follow this schema:
{
  "rejectionRisks": ["string"],
  "missingKeywords": ["string"],
  "bulletFixes": ["string"],
  "positioningFeedback": "string",
  "top5Actions": ["string"]
}

RULES:
- Do NOT give a numerical score.
- Do NOT give percentages.
- Do NOT rewrite the entire CV.
- Be concise, blunt, and practical.
`;

    const responseText = await callBackend(prompt, systemInstruction);

    // Attempt to parse JSON
    try {
        return JSON.parse(responseText);
    } catch (parseError) {
        console.warn("Direct JSON parse failed, attempting regex extraction...", parseError);
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Could not find valid JSON in response.");
    }
};

export const generatePerfectCV = async (jobDescription, currentCv) => {
    const systemInstruction = `You are a senior hiring manager and professional CV writer.
You specialise in tailoring CVs for specific roles while maintaining truthfulness, ATS compatibility, and recruiter readability.
You must not invent experience, qualifications, or achievements that are not present in the original CV.
Your goal is to maximise the candidate’s chances of being shortlisted for this role.
STRICT RULE: DO NOT INVENT FACTS. ONLY USE INFO FROM THE CANDIDATE'S CV.`;

    const prompt = `
JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S CURRENT CV:
${currentCv || "No CV provided. Create a template structure only."}

TASK:
Rewrite and tailor the CV specifically for this role.

REQUIREMENTS:
- Maximum length: 2 pages
- Use clear professional headings and bullet points
- Strongly prioritise skills, experience, and achievements relevant to the job description
- Quantify achievements where possible, but ONLY if supported by the original CV
- Optimise for ATS by naturally incorporating keywords from the job description
- Maintain a modern, professional, recruiter-friendly format
- Reframe existing experience to emphasise relevance, but DO NOT invent new roles, tools, or qualifications
- Remove or downplay irrelevant content
- STRICTLY NO HALLUCINATIONS: If the CV does not mention a specific skill required by the JD, DO NOT add it.

OUTPUT FORMAT:
Return a complete, clean, ready-to-submit CV in plain text.
Do not include explanations, commentary, or formatting instructions.
`;

    return await callBackend(prompt, systemInstruction);
};

export const generateCoverLetter = async (jobDescription, currentCv) => {
    const systemInstruction = `You are a senior recruiter and professional career writer.
You write concise, persuasive, role-specific cover letters that sound confident, human, and authentic.
You strictly avoid exaggeration, repetition, or false claims.
STRICT RULE: DO NOT INVENT FACTS. ONLY USE INFO FROM THE CANDIDATE'S CV.`;

    const prompt = `
JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S CV:
${currentCv || "No CV provided. Write a template cover letter structure."}

TASK:
Write a tailored cover letter for this role.

REQUIREMENTS:
- Maximum length: 1 page (200–300 words)
- Exactly 4 paragraphs, structured as follows:
  1. Introduction and motivation for the role and company
  2. Most relevant skills and experience aligned to the job description
  3. Key achievements or value the candidate brings (do not repeat CV bullets)
  4. Professional closing with a clear, confident call to action
- Align closely with the job description and company values
- Professional, confident, and engaging tone
- Do NOT repeat the CV verbatim
- Do NOT add false or unverified information
- STRICTLY NO HALLUCINATIONS: Do not claim experience the candidate does not have.

OUTPUT FORMAT:
Return a clean, ready-to-send cover letter in plain text.
Do not include explanations or notes.
`;

    return await callBackend(prompt, systemInstruction);
};
