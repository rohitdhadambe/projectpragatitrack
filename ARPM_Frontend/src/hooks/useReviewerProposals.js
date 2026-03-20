import { useEffect, useState } from "react";
import axios from "axios";

export default function useReviewerProposals(userId) {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchProposals = async () => {
            try {
                setLoading(true);

                const response = await axios.get(
                    `http://127.0.0.1:8000/proposals/reviewer/${userId}`
                );

                setProposals(response.data);
                setError(null);

            } catch (err) {
                console.error("Error fetching reviewer proposals:", err);
                setError("Failed to load proposals");
            } finally {
                setLoading(false);
            }
        };

        fetchProposals();
    }, [userId]);

    return { proposals, loading, error };
}