import { useEffect, useState } from "react";

export default function useProposals(pmId) {

    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchProposals = async () => {

            try {

                const res = await fetch(`http://127.0.0.1:8000/proposals/pm/${pmId}`);
                if (!res.ok) throw new Error("Failed to fetch proposals");

                const data = await res.json();

                setProposals(data);

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);

            }

        };

        fetchProposals();

    }, []);

    return { proposals, loading, error };
}