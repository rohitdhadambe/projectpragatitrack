export default function ProposalStatusCard({ proposal, onSubmit }) {

    return (

        <div className="bg-white p-6 rounded shadow">

            <p><b>Status:</b> {proposal.status}</p>

            {(proposal.status === "draft" || proposal.status === "returned_to_draft") && (
                <button
                    onClick={onSubmit}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
                >
                    Submit to PM
                </button>
            )}

        </div>

    );
}