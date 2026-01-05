# CV Writing Assistant

A powerful, AI-driven tool to help job seekers optimize their CVs and generate tailored application materials. Now features a secure Node.js backend architecture.

![UI Screenshot](https://rachelcooray.github.io/CV-Writer/assets/ui-preview.png)

## Features

- **Analyze & Feedback**: Get strict, hiring-manager-level feedback on your CV against a specific Job Description.
- **Generate Perfect CV**: Create a completely new, ATS-optimized CV draft tailored to the role.
- **Generate Cover Letter**: Write a persuasive, 1-page cover letter matching your experience to the job.
- **Privacy First**: API keys are secured server-side; no credentials are exposed to the browser.
- **Modern UI**: Glass-morphism design with a vibrant "Green-Blue-Purple" gradient theme.

## Architecture

This project uses a hybrid architecture for security:
- **Frontend**: React + Vite (Static UI)
- **Backend**: Node.js + Express (Secure Proxy for Gemini API)

The frontend sends requests to `/api/analyze`, and the backend forwards them to Google's Gemini API using the secure server-side API key.

## Quick Start

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/rachelcooray/CV-Writer.git
    cd CV-Writer
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_google_gemini_api_key
    PORT=3000
    ```

4.  **Run Locally**:
    ```bash
    # Runs the backend server (which serves the built frontend)
    npm run build
    npm run start
    ```
    Open [http://localhost:3000](http://localhost:3000).

    *For frontend-only dev mode (API calls will fail without proxy): `npm run dev`*

## Deployment (Render)

This project is configured for **Render** Web Services.

1.  Connect your GitHub repo to Render.
2.  **Runtime**: Node
3.  **Build Command**: `npm install && npm run build`
4.  **Start Command**: `npm run start`
5.  **Environment Variables**: Add `VITE_GEMINI_API_KEY`.

## Built With

- **AI**: Google Gemini 2.5 Flash
- **Frontend**: React, Vite, Framer Motion (removed), Lucide React
- **Backend**: Express.js
- **Parsing**: PDF.js
