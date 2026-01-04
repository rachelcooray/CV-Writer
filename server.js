import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

// API Route
app.post('/api/analyze', async (req, res) => {
    try {
        const { modelName, systemInstruction, prompt } = req.body;

        if (!process.env.VITE_GEMINI_API_KEY) {
            return res.status(500).json({ error: 'API Key not configured on server.' });
        }

        const model = genAI.getGenerativeModel({
            model: modelName || "gemini-2.5-flash",
            systemInstruction: systemInstruction
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ text: responseText });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Serve React App for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
