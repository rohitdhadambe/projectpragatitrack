import { useEffect, useState } from "react";

export default function useReviewer(reviewerId) {
    const [reviewer, setReviewer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!reviewerId) return;

        const fetchReviewer = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    `http://127.0.0.1:8000/proposal-reviewers/${reviewerId}`
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch reviewer");
                }

                const data = await res.json();
                setReviewer(data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviewer();
    }, [reviewerId]);

    return { reviewer, loading, error };
}