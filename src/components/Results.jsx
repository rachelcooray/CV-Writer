import { AlertTriangle, List, CheckCircle, Target, Sparkles } from 'lucide-react';

export const Results = ({ result }) => {
    if (!result) return null;

    return (
        <div className="results-panel">
            <div className="results-header">
                <h2>Expert Analysis</h2>
            </div>

            <div className="result-section">
                <h3><AlertTriangle size={18} /> Immediate Rejection Risks</h3>
                <div className="item-list">
                    {result.rejectionRisks.map((risk, i) => (
                        <div key={i} className="item risk-item">{risk}</div>
                    ))}
                    {result.rejectionRisks.length === 0 && <div className="item suggestion-item">No immediate risks identified.</div>}
                </div>
            </div>

            <div className="grid-2">
                <div className="result-section">
                    <h3><List size={18} /> Missing or Weak Keywords</h3>
                    <div className="item-list">
                        {result.missingKeywords.map((kw, i) => (
                            <div key={i} className="item suggestion-item">{kw}</div>
                        ))}
                    </div>
                </div>

                <div className="result-section">
                    <h3><Target size={18} /> Overall Positioning Advice</h3>
                    <div className="item suggestion-item" style={{ height: '100%', minHeight: '100px' }}>
                        {result.positioningFeedback}
                    </div>
                </div>
            </div>

            <div className="result-section">
                <h3><Sparkles size={18} /> Bullet-Level Rewrite Suggestions</h3>
                <div className="item-list">
                    {result.bulletFixes.map((bf, i) => (
                        <div key={i} className="item suggestion-item">{bf}</div>
                    ))}
                </div>
            </div>

            <div className="result-section">
                <h3><CheckCircle size={18} /> Top 5 Fixes to Do First</h3>
                <div className="item-list">
                    {result.top5Actions.map((fix, i) => (
                        <div key={i} className="item fix-item">
                            <span style={{ fontWeight: 800, marginRight: '0.5rem' }}>{i + 1}.</span> {fix}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
