import React, { useState, useEffect } from 'react';

const GoogleSheetComments = ({ csvUrl, formUrl }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(csvUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const text = await response.text();
                const parsedComments = parseCSV(text);
                setComments(parsedComments);
            } catch (err) {
                console.error("Error fetching comments:", err);
                setError('Unable to load comments at this time.');
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [csvUrl]);

    // Simple CSV parser handling quoted fields
    const parseCSV = (text) => {
        const lines = text.split('\n');
        const headers = lines[0].split(',');

        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Handle quoted fields (e.g. comments with commas)
            const row = [];
            let inQuotes = false;
            let currentValue = '';

            for (let char of line) {
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    row.push(currentValue);
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }
            row.push(currentValue); // Push the last value

            // Map to object based on known structure or index
            // CSV Structure: Timestamp, Your Name, Comment/Feedback, Today's Date (Optional)
            if (row.length >= 3) {
                result.push({
                    timestamp: row[0],
                    name: row[1].replace(/^"|"$/g, ''), // Remove surrounding quotes if present
                    text: row[2].replace(/^"|"$/g, '').replace(/""/g, '"'), // Unescape double quotes
                    date: row[3] ? row[3].replace(/^"|"$/g, '') : ''
                });
            }
        }
        return result.reverse(); // Show newest first
    };

    if (loading) return <div className="text-center text-stone-500 italic">Loading comments...</div>;
    if (error) return <div className="text-center text-red-800 italic">{error}</div>;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <a
                    href={formUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block px-6 py-3 bg-sepia-dark text-paper font-serif font-bold rounded shadow hover:bg-stone-800 transition-colors ${!formUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => !formUrl && e.preventDefault()}
                >
                    {formUrl ? "Leave a Comment" : "Setup Required: Add Form URL"}
                </a>
                {!formUrl && <p className="text-xs text-red-600 mt-2">Please provide the Google Form URL to enable commenting.</p>}
            </div>

            <div className="space-y-6">
                <div className="bg-white shadow border border-stone-200">
                    {formUrl ? (
                        <iframe
                            title="Leave a Comment"
                            src={formUrl}
                            className="w-full h-[800px] border-0"
                            loading="lazy"
                        />
                    ) : (
                        <div className="text-center p-6 text-sm text-stone-500 italic">
                            Add a Google Form URL to enable in-page comments.
                        </div>
                    )}
                </div>

                {comments.length === 0 ? (
                    <p className="text-center text-stone-500 italic">No comments yet. Be the first to share your thoughts.</p>
                ) : (
                    comments.map((comment, index) => (
                        <div key={index} className="bg-white p-6 shadow border border-stone-200">
                            <div className="flex justify-between items-baseline mb-2 border-b border-stone-100 pb-2">
                                <h4 className="font-bold text-sepia-dark">{comment.name}</h4>
                                <span className="text-xs text-stone-400">{comment.timestamp}</span>
                            </div>
                            <p className="text-stone-700 whitespace-pre-wrap font-serif leading-relaxed">{comment.text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GoogleSheetComments;
