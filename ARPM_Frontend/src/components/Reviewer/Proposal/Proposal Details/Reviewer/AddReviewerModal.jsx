import { useEffect, useState } from "react";

export default function AddReviewerModal({
    proposalId,
    assignedBy,
    onClose,
    onSuccess,
}) {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // 🔥 Fetch only reviewers (BEST: do this in backend ideally)
    useEffect(() => {
        fetch("http://localhost:8000/users")
            .then((res) => res.json())
            .then((data) => {
                const reviewersOnly = data.filter(
                    (u) => u.role?.toLowerCase() === "reviewer"
                );
                setUsers(reviewersOnly);
            })
            .catch(console.error);
    }, []);

    // 🔥 Smart filtering (min 2 chars + limit results)
    useEffect(() => {
        if (search.length < 2) {
            setFilteredUsers([]);
            return;
        }

        const filtered = users
            .filter(
                (u) =>
                    u.email?.toLowerCase().includes(search.toLowerCase()) ||
                    u.name?.toLowerCase().includes(search.toLowerCase())
            )
            .slice(0, 6); // ✅ limit results

        setFilteredUsers(filtered);
    }, [search, users]);

    const handleSubmit = async () => {
        if (!selectedUser) return;
        console.log("Selected User:", selectedUser);
        const payload = {
            proposal_id: proposalId,
            reviewer_id: selectedUser.id,
            assigned_by: assignedBy,
            status: "pending"   // ✅ REQUIRED
        };

        try {
            const res = await fetch(
                "http://localhost:8000/proposal-reviewers/",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.detail);
                return;
            }

            onSuccess(data);
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">

            <div className="bg-white p-6 rounded-2xl w-[420px] shadow-2xl border">

                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Assign Reviewer
                </h3>

                {/* Input */}
                <input
                    type="text"
                    placeholder="Type email or name..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setSelectedUser(null);
                    }}
                    className="w-full border border-gray-300 p-2.5 rounded-xl mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                {/* Dropdown */}
                {search.length >= 2 && (
                    <div className="max-h-44 overflow-y-auto border border-gray-200 rounded-xl mb-4 shadow-sm">

                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((u) => (
                                <div
                                    key={u.user_id}
                                    onClick={() => {
                                        setSelectedUser(u);
                                        setSearch(u.email);
                                    }}
                                    className={`px-3 py-2 cursor-pointer transition rounded-lg mx-1 my-1 ${selectedUser?.user_id === u.user_id
                                        ? "bg-purple-100 text-purple-700"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    <div className="text-sm font-medium">
                                        {u.name || "No Name"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {u.email}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-sm text-gray-500">
                                No reviewers found
                            </div>
                        )}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-2">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!selectedUser}
                        className={`px-5 py-2 rounded-xl text-white transition ${selectedUser
                            ? "bg-purple-600 hover:bg-purple-700 shadow-md"
                            : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        Assign
                    </button>

                </div>
            </div>
        </div>
    );
}