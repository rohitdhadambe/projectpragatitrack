import { MdEditSquare } from "react-icons/md";

export default function ProposalHeader({ proposal, onEdit, onSubmit }) {

    const editableStatuses = [
        "draft",
        "returned_by_pm",
        "returned_by_reviewer"
    ];

    const statusConfig = {
        draft: {
            label: "Draft",
            style: "bg-gray-100 text-gray-700"
        },
        submitted_to_pm: {
            label: "Submitted to PM",
            style: "bg-blue-100 text-blue-700"
        },
        returned_by_pm: {
            label: "Returned by PM",
            style: "bg-orange-100 text-orange-700"
        },
        under_reviewer_assignment: {
            label: "Assigning Reviewers",
            style: "bg-purple-100 text-purple-700"
        },
        submitted_to_reviewers: {
            label: "Sent to Reviewers",
            style: "bg-indigo-100 text-indigo-700"
        },
        under_review: {
            label: "Under Review",
            style: "bg-yellow-100 text-yellow-800"
        },
        returned_by_reviewer: {
            label: "Returned by Reviewer",
            style: "bg-orange-100 text-orange-700"
        },
        review_completed: {
            label: "Review Completed",
            style: "bg-green-100 text-green-700"
        },
        forwarded_to_committee: {
            label: "Sent to Committee",
            style: "bg-purple-200 text-purple-900"
        },
        approved: {
            label: "Approved",
            style: "bg-green-200 text-green-900"
        },
        rejected: {
            label: "Rejected",
            style: "bg-red-100 text-red-700"
        }
    };

    const status = statusConfig[proposal.status] || {
        label: proposal.status,
        style: "bg-gray-100 text-gray-700"
    };

    return (

        <div className="flex justify-between items-center mb-6">

            {/* LEFT */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Proposal Details
                </h1>

                <p className="text-sm text-gray-500">
                    Track status and manage your proposal
                </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

                {/* STATUS BADGE */}
                <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${status.style}`}
                >
                    {status.label}
                </span>

                {/* SUBMIT BUTTON (ONLY IN DRAFT) */}
                {/* {proposal.status === "draft" && (
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition"
                    >
                        Submit to PM
                    </button>
                )} */}

                {/* EDIT BUTTON */}
                {editableStatuses.includes(proposal.status) && (
                    <button
                        onClick={onEdit}
                        className="p-2 rounded-lg hover:bg-gray-100 transition group"
                        title="Edit Proposal"
                    >
                        <span className="text-lg group-hover:scale-110 transition">
                            <MdEditSquare />
                        </span>
                    </button>
                )}

            </div>

        </div>
    );
}