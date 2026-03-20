import { useEffect, useState } from "react";

export default function BudgetDetailsCard({ proposalId }) {

    const [budget, setBudget] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBudget();
    }, [proposalId]);

    const fetchBudget = async () => {

        try {
            setLoading(true);

            const res = await fetch(
                `http://127.0.0.1:8000/budget-proposals/${proposalId}`
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.detail);

            setBudget(data.budget);
            setDocuments(data.documents);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow">
                Loading budget...
            </div>
        );
    }

    if (!budget) {
        return (
            <div className="bg-white p-6 rounded-xl shadow text-gray-500">
                No budget proposal available
            </div>
        );
    }

    return (

        <div className="bg-white rounded-xl shadow p-6 space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">

                <h2 className="text-xl font-semibold text-purple-700">
                    Budget Proposal
                </h2>

                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    ₹ {formatCurrency(budget.total_budget)}
                </span>

            </div>

            {/* JUSTIFICATION */}
            {budget.justification && (
                <div>
                    <h3 className="font-semibold text-gray-700 mb-1">
                        Justification
                    </h3>
                    <p className="text-gray-600 text-sm">
                        {budget.justification}
                    </p>
                </div>
            )}

            {/* COST BREAKDOWN */}
            <div className="border rounded-lg p-4">

                <h3 className="font-semibold text-gray-700 mb-3">
                    Cost Breakdown
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">

                    <Item label="Compute" value={budget.compute_cost} />
                    <Item label="Data" value={budget.data_acquisition_cost} />
                    <Item label="Manpower" value={budget.manpower_cost} />
                    <Item label="Infrastructure" value={budget.infrastructure_cost} />
                    <Item label="Miscellaneous" value={budget.miscellaneous_cost} />

                </div>

            </div>

            {/* JSON BREAKDOWN */}
            {budget.budget_breakdown && (
                <div>

                    <h3 className="font-semibold text-gray-700 mb-2">
                        Detailed Breakdown
                    </h3>

                    <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">

                        {Object.entries(budget.budget_breakdown).map(([key, value]) => (

                            <div key={key} className="flex justify-between">

                                <span className="text-gray-600">
                                    {formatLabel(key)}
                                </span>

                                <span className="font-medium">
                                    {value}
                                </span>

                            </div>

                        ))}

                    </div>

                </div>
            )}

            {/* DOCUMENTS */}
            <div>

                <h3 className="font-semibold text-gray-700 mb-3">
                    Documents
                </h3>

                {documents.length === 0 && (
                    <p className="text-sm text-gray-400">
                        No documents uploaded
                    </p>
                )}

                <div className="space-y-2">

                    {documents.map((doc) => (

                        <div
                            key={doc.id}
                            className="flex justify-between items-center border p-3 rounded-lg"
                        >

                            <span className="text-sm">
                                {doc.name}
                            </span>

                            <a
                                href={doc.file}
                                target="_blank"
                                rel="noreferrer"
                                className="text-purple-600 text-sm hover:underline"
                            >
                                View
                            </a>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

/* ================= SMALL COMPONENTS ================= */

function Item({ label, value }) {
    return (
        <div className="flex justify-between">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium">
                ₹ {formatCurrency(value)}
            </span>
        </div>
    );
}

function formatCurrency(num) {
    return Number(num || 0).toLocaleString("en-IN");
}

function formatLabel(key) {
    return key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}