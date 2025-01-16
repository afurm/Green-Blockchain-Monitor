'use client';

import { useState } from 'react';

interface FeedbackProps {
    type: 'insight' | 'alert' | 'anomaly';
    id: string;
    onFeedbackSubmit?: () => void;
}

export default function InsightFeedback({ type, id, onFeedbackSubmit }: FeedbackProps) {
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (rating === null) {
            setError('Please provide a rating');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/insights/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    id,
                    feedback: {
                        rating,
                        comment,
                        timestamp: new Date().toISOString()
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            setSuccess(true);
            if (onFeedbackSubmit) {
                onFeedbackSubmit();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="p-2 text-sm text-green-600">
                Thank you for your feedback!
            </div>
        );
    }

    return (
        <div className="p-2 space-y-2">
            <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        onClick={() => setRating(value)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            rating === value
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        {value}
                    </button>
                ))}
            </div>

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Additional comments (optional)"
                className="w-full p-2 text-sm border rounded-md"
                rows={2}
            />

            {error && (
                <div className="text-sm text-red-600">
                    {error}
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
                {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
        </div>
    );
} 