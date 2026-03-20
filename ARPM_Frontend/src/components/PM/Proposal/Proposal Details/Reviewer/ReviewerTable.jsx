import { useEffect, useState } from "react";
import DeleteModal from "./DeleteModal";
import AddReviewerModal from "./AddReviewerModal";
import { useAuth } from "../../../../../components/context/AuthContext";
import { FiUserPlus } from "react-icons/fi";

export default function ReviewerTable({ proposalId }) {
    const { user } = useAuth();

    const [reviewers, setReviewers] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(true);

    const [selectedReviewer, setSelectedReviewer] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // 🔥 Fetch reviewers
    const fetchReviewers = async () => {
        try {
            const res = await fetch(
                `http://localhost:8000/proposal-reviewers/proposal/${proposalId}`
            );
            const data = await res.json();
            setReviewers(data);
        } catch (err) {
            console.error(err);
        }
    };

    // 🔥 Fetch users (for email mapping)
    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:8000/users");
            const data = await res.json();

            const map = {};
            data.forEach((u) => {
                map[u.id] = u;
            });

            setUsersMap(map);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const load = async () => {
            await fetchReviewers();
            await fetchUsers();
            setLoading(false);
        };

        load();
    }, [proposalId]);

    const handleDelete = async (id) => {
        await fetch(`http://localhost:8000/proposal-reviewers/${id}`, {
            method: "DELETE",
        });

        setReviewers((prev) => prev.filter((r) => r.id !== id));
    };

    const handleAdd = (newReviewer) => {
        setReviewers((prev) => [...prev, newReviewer]);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-4 bg-white rounded-xl shadow relative">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Assigned Reviewers</h2>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition"
                >
                    <FiUserPlus />
                    Add Reviewer
                </button>
            </div>

            {/* Empty */}
            {reviewers.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No reviewers assigned yet 🚫
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-xl overflow-hidden">

                        {/* Header */}
                        <thead className="bg-gray-100 text-gray-700 text-sm">
                            <tr>
                                <th className="p-3 text-left w-[30%]">Reviewer Email</th>
                                <th className="p-3 text-left w-[30%]">Assigned By</th>
                                <th className="p-3 text-left w-[25%]">Assigned At</th>
                                <th className="p-3 text-center w-[15%]">Action</th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody className="text-sm">
                            {reviewers.map((r) => {
                                const reviewer = usersMap[r.reviewer_id];
                                const assignedByUser = usersMap[r.assigned_by];

                                return (
                                    <tr
                                        key={r.id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        {/* Reviewer Email */}
                                        <td className="p-3 font-medium text-gray-800">
                                            {reviewer?.email || "Unknown"}
                                        </td>

                                        {/* Assigned By */}
                                        <td className="p-3 text-gray-600">
                                            {assignedByUser?.email || "Unknown"}
                                        </td>

                                        {/* Date */}
                                        <td className="p-3 text-gray-500">
                                            {new Date(r.assigned_at).toLocaleString()}
                                        </td>

                                        {/* Action */}
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => setSelectedReviewer(r)}
                                                className="text-red-500 hover:text-red-700 transition"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            )}

            {/* Delete */}
            {selectedReviewer && (
                <DeleteModal
                    reviewer={selectedReviewer}
                    onClose={() => setSelectedReviewer(null)}
                    onConfirm={() => {
                        handleDelete(selectedReviewer.id);
                        setSelectedReviewer(null);
                    }}
                />
            )}

            {/* Add Reviewer */}
            {showAddModal && (
                <AddReviewerModal
                    proposalId={proposalId}
                    assignedBy={user?.user_id}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleAdd}
                />
            )}
        </div>
    );
}