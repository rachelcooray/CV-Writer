import { Briefcase } from 'lucide-react';

export const JDInput = ({ value, onChange }) => {
    return (
        <div className="field-group card">
            <label><Briefcase size={18} /> Job Description</label>
            <textarea
                placeholder="Paste the role requirements, responsibilities, and key skills here..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};
