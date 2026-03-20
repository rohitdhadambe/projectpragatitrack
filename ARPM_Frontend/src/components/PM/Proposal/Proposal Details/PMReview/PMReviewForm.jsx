import { useState } from "react";

export default function PMReviewForm({ proposal, onSubmit }) {

    const [form, setForm] = useState({
        problem_clarity: 3,
        relevance: 3,
        innovation: 3,

        technical_feasibility: 3,
        resource_feasibility: 3,
        timeline_feasibility: 3,

        proposal_quality: 3,

        strengths: "",
        concerns: "",
        recommendation: "",

        decision: "approved"
    });

    const handleSubmit = async () => {
        try {
            const payload = {
                proposal_id: proposal.id,
                reviewer_id: 1,
                role: "project_manager",
                structured_feedback: {
                    problem_evaluation: {
                        clarity: form.problem_clarity,
                        relevance: form.relevance,
                        innovation: form.innovation
                    },
                    feasibility: {
                        technical: form.technical_feasibility,
                        resources: form.resource_feasibility,
                        timeline: form.timeline_feasibility
                    },
                    proposal_quality: form.proposal_quality,
                    comments: {
                        strengths: form.strengths,
                        concerns: form.concerns,
                        recommendation: form.recommendation
                    }
                },
                general_remark: form.recommendation,
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

            if (!res.ok) {
                throw new Error(data.detail || "Something went wrong");
            }

            // ✅ SUCCESS POPUP
            alert("✅ Review submitted successfully!");

            // ✅ OPTIONAL: update parent
            onSubmit(data);

            // ✅ RELOAD PAGE
            window.location.reload();

        } catch (err) {
            alert("❌ " + err.message);
        }
    };

    return (

        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">

            <h3 className="text-lg font-semibold text-gray-800">
                Project Manager Evaluation
            </h3>

            {/* ================= PROBLEM ================= */}
            <Section title="Problem & Idea Evaluation">

                <Select label="Problem Clarity" value={form.problem_clarity}
                    onChange={(v) => setForm({ ...form, problem_clarity: v })} />

                <Select label="Relevance to Domain" value={form.relevance}
                    onChange={(v) => setForm({ ...form, relevance: v })} />

                <Select label="Innovation / Novelty" value={form.innovation}
                    onChange={(v) => setForm({ ...form, innovation: v })} />

            </Section>

            {/* ================= FEASIBILITY ================= */}
            <Section title="Feasibility Assessment">

                <Select label="Technical Feasibility" value={form.technical_feasibility}
                    onChange={(v) => setForm({ ...form, technical_feasibility: v })} />

                <Select label="Resource Feasibility" value={form.resource_feasibility}
                    onChange={(v) => setForm({ ...form, resource_feasibility: v })} />

                <Select label="Timeline Feasibility" value={form.timeline_feasibility}
                    onChange={(v) => setForm({ ...form, timeline_feasibility: v })} />

            </Section>

            {/* ================= QUALITY ================= */}
            <Section title="Proposal Quality">

                <Select label="Clarity & Structure" value={form.proposal_quality}
                    onChange={(v) => setForm({ ...form, proposal_quality: v })} />

            </Section>

            {/* ================= COMMENTS ================= */}
            <div className="space-y-4">

                <Textarea
                    label="Strengths (What is good in this proposal?)"
                    value={form.strengths}
                    onChange={(v) => setForm({ ...form, strengths: v })}
                />

                <Textarea
                    label="Concerns (Risks / Weaknesses)"
                    value={form.concerns}
                    onChange={(v) => setForm({ ...form, concerns: v })}
                />

                <Textarea
                    label="Recommendation (Actionable suggestion)"
                    value={form.recommendation}
                    onChange={(v) => setForm({ ...form, recommendation: v })}
                />

            </div>

            {/* ================= DECISION ================= */}
            <div className="flex items-center justify-between pt-4 border-t">

                <select
                    className="border rounded-lg px-3 py-2"
                    value={form.decision}
                    onChange={(e) => setForm({ ...form, decision: e.target.value })}
                >
                    <option value="approved">Approve & Send to Reviewers</option>
                    <option value="revise">Return to Researcher</option>
                </select>

                <button
                    onClick={handleSubmit}
                    className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"
                >
                    Submit Evaluation
                </button>

            </div>

        </div>
    );
}

/* ================= REUSABLE ================= */

function Section({ title, children }) {
    return (
        <div>
            <h4 className="font-semibold text-gray-700 mb-3">{title}</h4>
            <div className="grid grid-cols-3 gap-4">{children}</div>
        </div>
    );
}

function Select({ label, value, onChange }) {
    return (
        <div>
            <label className="text-sm text-gray-600">{label}</label>
            <select
                className="w-full border rounded-lg p-2 mt-1"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
            >
                {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                ))}
            </select>
        </div>
    );
}

function Textarea({ label, value, onChange }) {
    return (
        <div>
            <label className="text-sm text-gray-600">{label}</label>
            <textarea
                className="w-full border rounded-lg p-2 mt-1"
                rows={3}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}