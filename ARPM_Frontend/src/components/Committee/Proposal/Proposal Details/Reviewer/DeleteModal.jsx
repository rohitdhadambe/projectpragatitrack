import { useState } from "react";

export default function DeleteModal({ reviewer, onClose, onConfirm }) {
    const [input, setInput] = useState("");

    const isValid = input === "delete reviewer";

    return (
        <div className="absolute inset-0 flex items-center justify-center  z-50">

            <div className="bg-white p-6 rounded-2xl w-[400px] shadow-2xl border animate-scaleIn">

                <h3 className="text-lg font-semibold text-red-600 mb-2">
                    Delete Reviewer Assignment
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                    This action cannot be undone. <br />
                    Type <b className="text-red-500">delete reviewer</b> to confirm.
                </p>

                {/* Input */}
                <input
                    type="text"
                    placeholder="delete reviewer"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full border border-gray-300 p-2.5 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                />

                {/* Buttons */}
                <div className="flex justify-end gap-2">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!isValid}
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-xl text-white transition ${isValid
                            ? "bg-red-600 hover:bg-red-700 shadow-md"
                            : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        Delete
                    </button>

                </div>
            </div>
        </div>
    );
}