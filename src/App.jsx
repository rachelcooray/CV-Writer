import { useState } from 'react';
import { JDInput } from './components/JDInput';
import { CVUpload } from './components/CVUpload';
import { AnalyzeButton } from './components/AnalyzeButton';
import { Results } from './components/Results';
import { extractPdfText } from './utils/extractPdfText';
import { preprocessText } from './utils/preprocessText';
import { analyzeCV, generatePerfectCV, generateCoverLetter } from './utils/geminiClient';
import { AlertCircle, FileText, Mail, CheckCircle } from 'lucide-react';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [activeTab, setActiveTab] = useState('feedback'); // 'feedback', 'cv', 'cover-letter'
  const [error, setError] = useState(null);

  const handleFileChange = async (file) => {
    if (file && file.type === 'application/pdf') {
      setIsExtracting(true);
      setError(null);
      try {
        const rawText = await extractPdfText(file);
        const cleanedText = preprocessText(rawText, 'cv');

        if (cleanedText.length < 50) {
          setError("Warning: Extracted text looks too short. The PDF might be an image or corrupted.");
        }

        setCvText(cleanedText);
        setCvFile(file);
      } catch (err) {
        console.error("Extraction Failed:", err);
        setError(`Extraction Failed: ${err.message}`);
      } finally {
        setIsExtracting(false);
      }
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleAction = async (actionType) => {
    if (!jobDescription) {
      setError("Please enter a job description first.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setGeneratedContent(null);
    setError(null);
    setActiveTab(actionType);

    try {
      const cleanedJD = preprocessText(jobDescription, 'jd');

      if (actionType === 'feedback') {
        if (!cvText) {
          setError("Please upload a CV to get feedback.");
          setIsAnalyzing(false);
          return;
        }
        const analysisResult = await analyzeCV(cvText, cleanedJD);
        setResult(analysisResult);
      } else if (actionType === 'cv') {
        const content = await generatePerfectCV(cleanedJD, cvText);
        setGeneratedContent(content);
      } else if (actionType === 'cover-letter') {
        const content = await generateCoverLetter(cleanedJD, cvText);
        setGeneratedContent(content);
      }
    } catch (err) {
      console.error("Action Failed:", err);
      setError(`Action Failed: ${err.message || 'Check your network and API key'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Rachel Cooray's CV writing Assistant</h1>
        <p>Expert CV fixes from a Hiring Manager's perspective.</p>
      </header>

      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="input-grid">
        <JDInput
          value={jobDescription}
          onChange={setJobDescription}
        />

        <CVUpload
          file={cvFile}
          onFileChange={handleFileChange}
          isExtracting={isExtracting}
        />
      </div>

      <div className="action-buttons-container">
        <button
          className="btn-action"
          onClick={() => handleAction('feedback')}
          disabled={isAnalyzing || !cvText || !jobDescription}
        >
          {isAnalyzing && activeTab === 'feedback' ? <div className="spinner-sm"></div> : <CheckCircle size={18} />}
          Get Feedback
        </button>

        <button
          className="btn-action"
          onClick={() => handleAction('cv')}
          disabled={isAnalyzing || !jobDescription}
        >
          {isAnalyzing && activeTab === 'cv' ? <div className="spinner-sm"></div> : <FileText size={18} />}
          Generate Perfect CV
        </button>

        <button
          className="btn-action"
          onClick={() => handleAction('cover-letter')}
          disabled={isAnalyzing || !jobDescription}
        >
          {isAnalyzing && activeTab === 'cover-letter' ? <div className="spinner-sm"></div> : <Mail size={18} />}
          Generate Cover Letter
        </button>
      </div>

      {result && <Results result={result} />}

      {generatedContent && (
        <div className="results-panel">
          <div className="generated-content-card">
            <div className="content-header">
              <h2>{activeTab === 'cv' ? 'Optimized CV Draft' : 'Tailored Cover Letter'}</h2>
              <button
                className="btn-copy"
                onClick={() => navigator.clipboard.writeText(generatedContent)}
              >
                Copy Text
              </button>
            </div>
            <pre className="content-body">
              {generatedContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
