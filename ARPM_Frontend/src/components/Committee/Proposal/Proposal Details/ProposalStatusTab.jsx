export default function ProposalStatusTab({ proposal }) {

    const statusLabels = {
        draft: "Draft",
        submitted_to_pm: "Submitted to Project Manager",
        returned_by_pm: "Returned by PM",
        under_review: "Under Review",
        review_completed: "Review Completed",
        forwarded_to_committee: "Forwarded to Committee",
        approved: "Approved",
        rejected: "Rejected"
    };

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
                Proposal Status
            </h2>

            <p>
                <b>Current Status:</b> {statusLabels[proposal.status]}
            </p>

            <p className="mt-4 text-gray-500">
                Remarks from reviewers or project manager will appear here.
            </p>

        </div>
    );
}