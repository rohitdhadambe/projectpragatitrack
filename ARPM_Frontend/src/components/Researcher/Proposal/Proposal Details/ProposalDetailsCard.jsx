export default function ProposalDetailsCard({ proposal }) {

    const statusStyles = {
        draft: "bg-gray-100 text-gray-700",
        submitted_to_pm: "bg-blue-100 text-blue-700",
        under_review: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-200 text-green-900",
        rejected: "bg-red-100 text-red-700"
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleString();
    };

    return (

        <div className="bg-white rounded-2xl shadow p-6 space-y-6">

            {/* ================= HEADER ================= */}
            <div className="flex justify-between items-start">

                <div>
                    <h2 className="text-2xl font-semibold text-purple-700">
                        {proposal.title}
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {proposal.research_domain}
                    </p>
                </div>

                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[proposal.status] || "bg-gray-100"
                        }`}
                >
                    {proposal.status}
                </span>

            </div>

            {/* ================= BASIC INFO ================= */}
            <Section title="Basic Information">

                <Info label="Lead Researcher ID" value={proposal.lead_researcher_id} />
                <Info label="Project Manager" value={proposal.assigned_pm_id} />
                <Info label="Duration (Months)" value={proposal.proposed_duration_months} />
                <Info label="Team Size" value={proposal.team_size_estimate} />
                <Info label="Budget Estimate" value={`₹ ${proposal.rough_budget_estimate?.toLocaleString("en-IN")}`} />

            </Section>

            {/* ================= RESEARCH DETAILS ================= */}
            <Section title="Research Details">

                <TextBlock label="Abstract" value={proposal.abstract} />
                <TextBlock label="Problem Statement" value={proposal.problem_statement} />
                <TextBlock label="Motivation" value={proposal.motivation} />
                <TextBlock label="Objectives" value={proposal.objectives} />
                <TextBlock label="Methodology" value={proposal.methodology_overview} />
                <TextBlock label="Novelty / Innovation" value={proposal.novelty} />
                <TextBlock label="Expected Outcomes" value={proposal.expected_outcomes} />
                <TextBlock label="Potential Impact" value={proposal.potential_impact} />

            </Section>

            {/* ================= RESOURCES ================= */}
            <Section title="Resources & Requirements">

                <TextBlock
                    label="Required Resources"
                    value={proposal.required_resources_summary}
                />

            </Section>

            {/* ================= TIMESTAMPS ================= */}
            <Section title="Timeline Information">

                <Info label="Submitted At" value={formatDate(proposal.submitted_at)} />
                <Info label="Created At" value={formatDate(proposal.created_at)} />
                <Info label="Last Updated" value={formatDate(proposal.updated_at)} />

            </Section>

        </div>
    );
}


/* ================= REUSABLE COMPONENTS ================= */

function Section({ title, children }) {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">
                {title}
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="flex flex-col">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="font-medium text-gray-800">
                {value || "-"}
            </span>
        </div>
    );
}

function TextBlock({ label, value }) {
    return (
        <div className="col-span-2">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-gray-800 whitespace-pre-line">
                {value || "-"}
            </p>
        </div>
    );
}