import { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';

export const CVUpload = ({ file, onFileChange, isExtracting }) => {
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) onFileChange(selectedFile);
    };

    return (
        <div className="field-group card">
            <label><FileText size={18} /> Candidate CV (PDF)</label>
            <div
                className="file-input"
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="icon">
                    <Upload size={32} />
                </div>
                {isExtracting ? (
                    <p>Extracting text...</p>
                ) : file ? (
                    <p><strong>{file.name}</strong><br /><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click to change</span></p>
                ) : (
                    <p>Drag and drop or click to upload<br /><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PDF format only</span></p>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept=".pdf"
                hidden
            />
        </div>
    );
};
