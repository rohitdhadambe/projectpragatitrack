import { useNavigate } from "react-router-dom";

export default function ProposalTable({ proposals = [], visibleColumns = [] }) {

    const navigate = useNavigate();

    const columnLabels = {
        title: "Title",
        lead_researcher_id: "Researcher ID",
        assigned_pm_id: "Project Manager",
        research_domain: "Domain",
        abstract: "Abstract",
        problem_statement: "Problem",
        motivation: "Motivation",
        objectives: "Objectives",
        methodology_overview: "Methodology",
        novelty: "Novelty",
        expected_outcomes: "Expected Outcomes",
        potential_impact: "Impact",
        proposed_duration_months: "Duration (Months)",
        rough_budget_estimate: "Budget",
        team_size_estimate: "Team Size",
        required_resources_summary: "Resources",
        status: "Status"
    };

    const statusLabels = {
        draft: "Draft",

        submitted_to_pm: "Submitted to Project Manager",

        returned_to_draft: "Returned for Revision",

        submitted_to_reviewers: "Sent to Reviewers",

        review_completed: "Review Completed",

        submitted_to_committee: "Under Committee Review",

        approved: "Approved",
        rejected: "Rejected"
    };

    const statusStyles = {
        draft: "bg-gray-100 text-gray-700",

        submitted_to_pm: "bg-blue-100 text-blue-700",

        returned_to_draft: "bg-orange-100 text-orange-700",

        submitted_to_reviewers: "bg-indigo-100 text-indigo-700",

        review_completed: "bg-green-100 text-green-700",

        submitted_to_committee: "bg-purple-100 text-purple-800",

        approved: "bg-green-200 text-green-900",
        rejected: "bg-red-100 text-red-700"
    };
    const formatValue = (value, column) => {

        if (value === null || value === undefined) return "-";

        if (column === "rough_budget_estimate") {
            return `₹ ${Number(value).toLocaleString("en-IN")}`;
        }

        if (column === "status") {
            return statusLabels[value] || value;
        }

        return String(value);
    };

    const truncateText = (value, column) => {

        const text = formatValue(value, column);

        if (text.length <= 100) return text;

        return text.slice(0, 100) + "...";
    };

    return (

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl">

            <div className="w-full overflow-x-auto">

                <table className="min-w-full text-sm text-gray-700">

                    {/* HEADER */}
                    <thead className="bg-gray-50 border-b">

                        <tr>

                            {visibleColumns.map((col) => (

                                <th
                                    key={col}
                                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap"
                                >
                                    {columnLabels[col] || col}
                                </th>

                            ))}

                        </tr>

                    </thead>

                    {/* BODY */}
                    <tbody className="divide-y divide-gray-100">

                        {proposals.length === 0 && (

                            <tr>

                                <td
                                    colSpan={visibleColumns.length}
                                    className="p-8 text-center text-gray-400"
                                >
                                    No proposals found
                                </td>

                            </tr>

                        )}

                        {proposals.map((proposal, index) => (

                            <tr
                                key={proposal.id}

                                onClick={() =>
                                    navigate(`/manager/proposals/${proposal.id}`)
                                }

                                className={`cursor-pointer transition hover:bg-gray-50 ${index % 2 === 0
                                    ? "bg-white"
                                    : "bg-gray-50/40"
                                    }`}
                            >

                                {visibleColumns.map((col) => {

                                    const value = proposal[col];

                                    return (

                                        <td
                                            key={col}
                                            className="px-5 py-4 max-w-[260px]"
                                        >

                                            {col === "status" ? (

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[value]
                                                        }`}
                                                >
                                                    {statusLabels[value]}
                                                </span>

                                            ) : (

                                                <span title={formatValue(value, col)}>
                                                    {truncateText(value, col)}
                                                </span>

                                            )}

                                        </td>

                                    );

                                })}

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );
}