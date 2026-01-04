# Rachel Cooray's CV writing Assistant

A modern, minimalist tool designed to provide high-value, actionable CV feedback from a hiring manager's perspective. No scoring fluff—just direct fixes to help you get the interview.

## Features

- **Reliable PDF Parsing**: Extracts text while preserving section order.
- **AI-Powered Analysis**: Uses Gemini 2.5 Flash to identify rejection risks and missing keywords.
- **Actionable Advice**: Provides bullet-level rewrite suggestions and a prioritized "Top 5 Fixes" list.
- **Minimalist Aesthetic**: Premium, distraction-free UI with Lucide-React icons.

## Prerequisites

- **Node.js**: `v20.19.0`+ or `v22.12.0`+ (Recommended).
  *Note: The project is currently configured to run on version `20.3.0` for compatibility.*
- **NPM**: `v9` or later.

## Quick Start

1. **Navigate to the project root**:
   ```bash
   cd CV-Writer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Gemini API Key**:
   Update the `GEMINI_API_KEY` in `src/utils/geminiClient.js` with your own key.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Built With

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Google Generative AI SDK](https://github.com/google/generative-ai-js)
- [PDF.js](https://mozilla.github.io/pdf.js/)
- [Lucide React](https://lucide.dev/)

## Project Structure

- `src/components`: UI elements (Inputs, Upload, Results).
- `src/utils`: Core logic (PDF extraction, Text cleaning, Gemini API client).

