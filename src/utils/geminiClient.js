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
    const systemInstruction = `You are a senior hiring manager and resume coach. 
You have to create an ideal CV for a candidate applying to a specific role. 
Focus on ATS optimization, keyword inclusion, clear structure, and role-specific positioning. 
Do not assume any candidate background unless provided; invent realistic, plausible experience if needed for demonstration purposes, but keep it credible for a graduate/early-career applicant.`;

    const prompt = `
JOB DESCRIPTION:
${jobDescription}

OPTIONAL: CURRENT CV:
${currentCv || "Not provided - please generate a realistic template based on the JD."}

TASK:
Generate a complete CV optimized for this role. Include:
- Professional Summary / Objective
- Skills
- Education
- Work Experience / Projects (realistic and tailored to the role)
- Certifications if relevant
- Achievements or notable projects

RULES:
- Use role-specific keywords from the job description.
- Focus on clarity, impact, and recruiter readability.
- Do not include irrelevant or unprofessional information.
- Output as plain text, ready to copy into a CV template.
`;

    return await callBackend(prompt, systemInstruction);
};

export const generateCoverLetter = async (jobDescription, currentCv) => {
    const systemInstruction = `You are a professional recruiter and career coach. 
You write persuasive, concise, and tailored cover letters for applicants, highlighting relevant experience, skills, and motivation for a specific role. 
The letter should feel professional, human, and genuine, not generic.`;

    const prompt = `
JOB DESCRIPTION:
${jobDescription}

CANDIDATE INFO:
${currentCv || "Not provided - please base on typical qualifications for this role."}

TASK:
Write a tailored cover letter for the role. Include:
- Why the candidate is interested in this position and company
- Key relevant skills and experiences
- How the candidate will add value
- Professional and concise tone

RULES:
- 1 page max (200-300 words)
- Use role-specific keywords naturally
- Do not include exaggerations or false claims
- End with a strong, polite closing statement
`;

    return await callBackend(prompt, systemInstruction);
};
