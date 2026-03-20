import { useState, useEffect } from "react";

export default function ReviewerReviewForm({ proposal, onSubmit, user, existingReviews }) {

    const [loading, setLoading] = useState(false);
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);

    useEffect(() => {
        if (existingReviews && user) {
            const found = existingReviews.find(
                r => r.reviewer_id === user.user_id && r.role === "reviewer"
            );
            setAlreadyReviewed(!!found);
        }
    }, [existingReviews, user]);

    const [form, setForm] = useState({
        aspects: {
            novelty: { score: 5, comment: "", risk: "medium" },
            technical_feasibility: { score: 5, comment: "", risk: "medium" },
            impact: { score: 5, comment: "", risk: "medium" },
            implementation_complexity: { score: 5, comment: "", risk: "medium" },
            scalability: { score: 5, comment: "", risk: "medium" },
            timeline_feasibility: { score: 5, comment: "", risk: "medium" },
            team_capability: { score: 5, comment: "", risk: "medium" }
        },

        strengths: "",
        weaknesses: "",
        recommendation_summary: "",
        confidence: 0.8,
        decision: "approve"
    });

    const updateAspect = (key, field, value) => {
        setForm(prev => ({
            ...prev,
            aspects: {
                ...prev.aspects,
                [key]: {
                    ...prev.aspects[key],
                    [field]: value
                }
            }
        }));
    };

    const cleanArray = (text) =>
        text
            .split("\n")
            .map(s => s.trim())
            .filter(s => s.length > 0);

    const handleSubmit = async () => {

        if (!user?.user_id) {
            alert("User not loaded");
            return;
        }
        console.log("User in review", user)
        if (alreadyReviewed) {
            alert("You have already submitted a review");
            return;
        }

        try {
            setLoading(true);

            const scores = Object.values(form.aspects).map(a => a.score);
            const overall =
                scores.reduce((a, b) => a + b, 0) / scores.length;

            const payload = {
                proposal_id: proposal.id,
                reviewer_id: user.user_id,
                role: "reviewer",

                structured_feedback: {
                    overall_score: Number(overall.toFixed(2)),
                    confidence: form.confidence,
                    aspects: form.aspects,
                    strengths: cleanArray(form.strengths),
                    weaknesses: cleanArray(form.weaknesses),
                    recommendation_summary: form.recommendation_summary
                },

                general_remark: form.recommendation_summary,
                decision: form.decision
            };

            const res = await fetch(
                "http://127.0.0.1:8000/proposal-reviews/",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.detail);

            alert("✅ Review submitted");
            onSubmit(data);
            setAlreadyReviewed(true);

        } catch (err) {
            alert("❌ " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // 🚫 LOCK UI IF ALREADY REVIEWED
    if (alreadyReviewed) {
        return (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-700">
                ✅ You have already submitted your review.
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow space-y-6">

            <h3 className="text-lg font-semibold">
                Reviewer Evaluation (AI R&D Standard)
            </h3>

            {/* ASPECTS */}
            {Object.entries(form.aspects).map(([key, value]) => (
                <Aspect
                    key={key}
                    label={formatLabel(key)}
                    data={value}
                    onChange={(field, val) => updateAspect(key, field, val)}
                />
            ))}

            {/* TEXT */}
            <Textarea
                label="Strengths (one per line)"
                value={form.strengths}
                onChange={(v) => setForm({ ...form, strengths: v })}
            />

            <Textarea
                label="Weaknesses (one per line)"
                value={form.weaknesses}
                onChange={(v) => setForm({ ...form, weaknesses: v })}
            />

            <Textarea
                label="Recommendation Summary"
                value={form.recommendation_summary}
                onChange={(v) => setForm({ ...form, recommendation_summary: v })}
            />

            {/* CONFIDENCE */}
            <div>
                <label className="text-sm">Confidence (0–1)</label>
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={form.confidence}
                    onChange={(e) =>
                        setForm({ ...form, confidence: Number(e.target.value) })
                    }
                    className="w-full border p-2 rounded mt-1"
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-purple-600 text-white px-5 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Submitting..." : "Submit Review"}
            </button>

        </div>
    );
}

/* ================= COMPONENTS ================= */

function Aspect({ label, data, onChange }) {
    return (
        <div className="border p-4 rounded-lg space-y-2">

            <h4 className="font-semibold">{label}</h4>

            <div className="grid grid-cols-3 gap-3">

                <select
                    value={data.score}
                    onChange={(e) => onChange("score", Number(e.target.value))}
                    className="border p-2 rounded"
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n}>{n}</option>
                    ))}
                </select>

                <select
                    value={data.risk}
                    onChange={(e) => onChange("risk", e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                </select>

            </div>

            <textarea
                placeholder="Comment..."
                value={data.comment}
                onChange={(e) => onChange("comment", e.target.value)}
                className="w-full border p-2 rounded"
            />

        </div>
    );
}

function Textarea({ label, value, onChange }) {
    return (
        <div>
            <label className="text-sm">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border p-2 rounded mt-1"
            />
        </div>
    );
}

function formatLabel(key) {
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
}