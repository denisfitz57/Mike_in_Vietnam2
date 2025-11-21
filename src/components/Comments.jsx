import React from 'react';
import GoogleSheetComments from './GoogleSheetComments';

const Comments = () => {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNBP5QQdo8v93MiPtAz_AdGjmKjmp5QpVpXF53AtFXF-Pu8gqpn-DI-_albaWd32VQUoCgRcWUT3P6/pub?gid=946348382&single=true&output=csv";
    //const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeCKzznwmEcZMh5eee4rl0RSLU5Z586LUgIR5eT4hbq5BaZbA/viewform?usp=header";

    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeCKzznwmEcZMh5eee4rl0RSLU5Z586LUgIR5eT4hbq5BaZbA/viewform?embedded=true";

    return (
        <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-bold mb-8 text-sepia-dark border-b border-sepia-light pb-2">Comments & Reflections</h2>
            <GoogleSheetComments csvUrl={csvUrl} formUrl={formUrl} />
            <div className="mt-4 text-sm text-stone-500 italic text-center">
                Comments are powered by Google Sheets. No login required.
            </div>
        </div>
    );
};

export default Comments;
