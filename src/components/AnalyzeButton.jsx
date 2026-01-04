import { Search } from 'lucide-react';

export const AnalyzeButton = ({ onClick, disabled, isAnalyzing }) => {
    return (
        <div className="btn-container">
            <button
                onClick={onClick}
                disabled={disabled || isAnalyzing}
            >
                {isAnalyzing ? (
                    <>
                        <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                        Analyzing...
                    </>
                ) : (
                    <>
                        <Search size={20} />
                        Get Feedback
                    </>
                )}
            </button>
        </div>
    );
};
