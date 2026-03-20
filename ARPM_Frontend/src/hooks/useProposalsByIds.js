import { useEffect, useState } from "react";

export default function useProposalsByIds(proposalIds = []) {

    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!proposalIds || proposalIds.length === 0) {
            setProposals([]);
            return;
        }

        const fetchProposals = async () => {

            try {
                setLoading(true);

                const requests = proposalIds.map(id =>
                    fetch(`http://127.0.0.1:8000/proposals/${id}`)
                        .then(res => {
                            if (!res.ok) throw new Error("Failed proposal fetch");
                            return res.json();
                        })
                );

                const results = await Promise.all(requests);

                setProposals(results);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }

        };

        fetchProposals();

    }, [proposalIds]);

    return { proposals, loading, error };
}