import { useState } from "react";

export default function CommitteeReviewForm({ proposal, user, onSubmit }) {

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        overall_merit: 8,
        strategic_alignment: 8,
        risk_vs_reward: "balanced",
        funding_justification: "worth_investment",

        key_strengths: "",
        major_concerns: "",
        review_summary: "",

        approved_budget: proposal.rough_budget_estimate || 0,
        duration_months: proposal.proposed_duration_months || 0,

        decision: "approve"
    });

    const cleanArray = (text) =>
        text.split("\n").map(s => s.trim()).filter(Boolean);

    const handleSubmit = async () => {

        try {
            setLoading(true);

            const payload = {
                proposal_id: proposal.id,
                reviewer_id: user.user_id,
                role: "committee",

                structured_feedback: {
                    final_assessment: {
                        overall_merit: form.overall_merit,
                        strategic_alignment: form.strategic_alignment,
                        risk_vs_reward: form.risk_vs_reward,
                        funding_justification: form.funding_justification
                    },
                    decision_factors: {
                        key_strengths: cleanArray(form.key_strengths),
                        major_concerns: cleanArray(form.major_concerns)
                    },
                    review_summary: form.review_summary,
                    funding_recommendation: {
                        approved_budget: form.approved_budget,
                        duration_months: form.duration_months
                    }
                },

                general_remark: form.review_summary,
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

            alert("✅ Final decision submitted");
            onSubmit(data);
            window.location.reload();

        } catch (err) {
            alert("❌ " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow space-y-6">

            <h2 className="text-xl font-semibold text-purple-700">
                Committee Final Decision
            </h2>

            {/* SCORES */}
            <div className="grid grid-cols-2 gap-4">

                <Select
                    label="Overall Merit"
                    value={form.overall_merit}
                    onChange={(v) => setForm({ ...form, overall_merit: v })}
                />

                <Select
                    label="Strategic Alignment"
                    value={form.strategic_alignment}
                    onChange={(v) => setForm({ ...form, strategic_alignment: v })}
                />

                <SelectText
                    label="Risk vs Reward"
                    value={form.risk_vs_reward}
                    options={["low_risk", "balanced", "high_risk_high_reward"]}
                    onChange={(v) => setForm({ ...form, risk_vs_reward: v })}
                />

                <SelectText
                    label="Funding Justification"
                    value={form.funding_justification}
                    options={["not_worth", "borderline", "worth_investment"]}
                    onChange={(v) => setForm({ ...form, funding_justification: v })}
                />

            </div>

            {/* TEXT */}
            <Textarea
                label="Key Strengths (one per line)"
                value={form.key_strengths}
                onChange={(v) => setForm({ ...form, key_strengths: v })}
            />

            <Textarea
                label="Major Concerns (one per line)"
                value={form.major_concerns}
                onChange={(v) => setForm({ ...form, major_concerns: v })}
            />

            <Textarea
                label="Final Review Summary"
                value={form.review_summary}
                onChange={(v) => setForm({ ...form, review_summary: v })}
            />

            {/* FUNDING */}
            <div className="grid grid-cols-2 gap-4">

                <Input
                    label="Approved Budget (₹)"
                    value={form.approved_budget}
                    onChange={(v) => setForm({ ...form, approved_budget: v })}
                />

                <Input
                    label="Approved Duration (Months)"
                    value={form.duration_months}
                    onChange={(v) => setForm({ ...form, duration_months: v })}
                />

            </div>

            {/* DECISION */}
            <div>
                <label className="text-sm">Final Decision</label>

                <select
                    className="w-full border p-2 rounded mt-1"
                    value={form.decision}
                    onChange={(e) => setForm({ ...form, decision: e.target.value })}
                >
                    <option value="approve">Approve</option>
                    <option value="reject">Reject</option>
                </select>
            </div>

            {/* BUTTON */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"
            >
                {loading ? "Submitting..." : "Submit Final Decision"}
            </button>

        </div>
    );
}

/* REUSABLE */

function Select({ label, value, onChange }) {
    return (
        <div>
            <label className="text-sm">{label}</label>
            <select
                className="w-full border p-2 rounded mt-1"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n}>{n}</option>
                ))}
            </select>
        </div>
    );
}

function SelectText({ label, value, options, onChange }) {
    return (
        <div>
            <label className="text-sm">{label}</label>
            <select
                className="w-full border p-2 rounded mt-1"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map(opt => (
                    <option key={opt} value={opt}>
                        {opt.replace(/_/g, " ")}
                    </option>
                ))}
            </select>
        </div>
    );
}

function Input({ label, value, onChange }) {
    return (
        <div>
            <label className="text-sm">{label}</label>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full border p-2 rounded mt-1"
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
                rows={3}
            />
        </div>
    );
}