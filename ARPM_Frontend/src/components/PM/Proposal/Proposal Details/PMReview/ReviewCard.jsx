import { useState } from "react";

function ReviewCard({ review }) {
    const [expanded, setExpanded] = useState(false);

    const feedback = review.structured_feedback || {};

    const formatLabel = (key) =>
        key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    const getDecisionStyle = (decision) => {
        if (!decision) return "bg-gray-100 text-gray-600";

        const d = decision.toLowerCase();
        if (d.includes("approve")) return "bg-green-100 text-green-700";
        if (d.includes("reject")) return "bg-red-100 text-red-700";
        if (d.includes("revision")) return "bg-yellow-100 text-yellow-700";

        return "bg-purple-100 text-purple-700";
    };

    const getRiskStyle = (risk) => {
        if (risk === "low") return "text-green-600";
        if (risk === "medium") return "text-yellow-600";
        if (risk === "high") return "text-red-600";
        return "text-gray-500";
    };

    return (
        <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition space-y-3">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-purple-600 capitalize">
                    {review.role.replace("_", " ")}
                </span>

                <span className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                </span>
            </div>

            {/* DECISION */}
            {review.decision && (
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getDecisionStyle(review.decision)}`}>
                    {review.decision}
                </span>
            )}

            {/* 🔥 OVERALL SCORE (NEW IMPORTANT UI) */}
            {feedback.overall_score && (
                <div className="text-lg font-bold text-gray-800">
                    ⭐ Score: {feedback.overall_score}/10
                </div>
            )}

            {/* COLLAPSED */}
            {!expanded && review.general_remark && (
                <p className="text-sm text-gray-600 line-clamp-2">
                    {review.general_remark}
                </p>
            )}

            {/* EXPANDED */}
            {expanded && (
                <div className="space-y-4">

                    {/* ================= ASPECTS ================= */}
                    {feedback.aspects && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 mb-2">
                                Evaluation Aspects
                            </p>

                            <div className="space-y-2">
                                {Object.entries(feedback.aspects).map(([key, val]) => (
                                    <div key={key} className="border rounded-lg p-2">

                                        <div className="flex justify-between">
                                            <span className="font-medium text-sm">
                                                {formatLabel(key)}
                                            </span>

                                            <span className="text-sm font-semibold">
                                                {val.score}/10
                                            </span>
                                        </div>

                                        <p className={`text-xs ${getRiskStyle(val.risk)}`}>
                                            Risk: {val.risk}
                                        </p>

                                        {val.comment && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {val.comment}
                                            </p>
                                        )}

                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ================= STRENGTHS ================= */}
                    {feedback.strengths && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500">Strengths</p>
                            <ul className="list-disc list-inside text-sm text-green-700">
                                {feedback.strengths.map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ================= WEAKNESSES ================= */}
                    {feedback.weaknesses && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500">Weaknesses</p>
                            <ul className="list-disc list-inside text-sm text-red-700">
                                {feedback.weaknesses.map((w, i) => (
                                    <li key={i}>{w}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ================= SUMMARY ================= */}
                    {feedback.recommendation_summary && (
                        <div className="text-sm text-gray-700 border-l-2 border-purple-400 pl-2">
                            {feedback.recommendation_summary}
                        </div>
                    )}

                    {/* ================= FALLBACK (FOR PM OLD FORMAT) ================= */}
                    {!feedback.aspects &&
                        Object.entries(feedback).map(([key, value]) => (
                            <div key={key} className="text-sm">
                                <span className="text-gray-500">{formatLabel(key)}: </span>
                                <span className="font-medium">{JSON.stringify(value)}</span>
                            </div>
                        ))}

                </div>
            )}

            {/* TOGGLE */}
            <div className="flex justify-end">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-purple-600"
                >
                    {expanded ? "Show less ↑" : "Show more ↓"}
                </button>
            </div>

        </div>
    );
}

export default ReviewCard;