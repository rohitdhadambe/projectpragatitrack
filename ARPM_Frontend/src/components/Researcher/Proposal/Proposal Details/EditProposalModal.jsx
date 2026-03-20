import { useEffect, useState } from "react";

export default function EditProposalModal({
    proposal,
    onClose,
    onSave
}) {

    const [form, setForm] = useState({ ...proposal });
    const [documents, setDocuments] = useState([]);
    const [activeTab, setActiveTab] = useState("proposal");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        const res = await fetch(
            `http://127.0.0.1:8000/proposals/${proposal.id}/documents`
        );
        const data = await res.json();
        setDocuments(data);
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {

        setLoading(true);

        const res = await fetch(
            `http://127.0.0.1:8000/proposals/${proposal.id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            }
        );

        const data = await res.json();

        setLoading(false);
        onSave(data);
    };

    const replaceDocument = async (docId, file) => {

        const formData = new FormData();
        formData.append("file", file);

        await fetch(
            `http://127.0.0.1:8000/proposals/documents/${docId}/replace`,
            {
                method: "PUT",
                body: formData
            }
        );

        fetchDocuments(); // refresh
    };

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white w-[1000px] max-h-[90vh] rounded-2xl shadow-xl flex flex-col">

                {/* HEADER */}
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-lg font-semibold">Edit Proposal</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* TABS */}
                <div className="flex border-b px-5">

                    <Tab
                        label="Proposal"
                        active={activeTab === "proposal"}
                        onClick={() => setActiveTab("proposal")}
                    />

                    <Tab
                        label="Documents"
                        active={activeTab === "documents"}
                        onClick={() => setActiveTab("documents")}
                    />

                </div>

                {/* CONTENT */}
                <div className="p-6 overflow-y-auto">

                    {/* ================= PROPOSAL TAB ================= */}
                    {activeTab === "proposal" && (

                        <div className="space-y-6">

                            <Section title="Basic Information">

                                <Input label="Title" name="title" value={form.title} onChange={handleChange} />
                                <Input label="Project Manager" name="assigned_pm_id" value={form.assigned_pm_id} onChange={handleChange} />
                                <Input label="Research Domain" name="research_domain" value={form.research_domain} onChange={handleChange} />

                            </Section>

                            <Section title="Research Details">

                                <Textarea label="Abstract" name="abstract" value={form.abstract} onChange={handleChange} />
                                <Textarea label="Problem Statement" name="problem_statement" value={form.problem_statement} onChange={handleChange} />
                                <Textarea label="Motivation" name="motivation" value={form.motivation} onChange={handleChange} />
                                <Textarea label="Objectives" name="objectives" value={form.objectives} onChange={handleChange} />
                                <Textarea label="Methodology" name="methodology_overview" value={form.methodology_overview} onChange={handleChange} />
                                <Textarea label="Novelty" name="novelty" value={form.novelty} onChange={handleChange} />

                            </Section>

                            <Section title="Planning">

                                <Input label="Duration (Months)" name="proposed_duration_months" value={form.proposed_duration_months} onChange={handleChange} />
                                <Input label="Team Size" name="team_size_estimate" value={form.team_size_estimate} onChange={handleChange} />
                                <Input label="Budget (₹)" name="rough_budget_estimate" value={form.rough_budget_estimate} onChange={handleChange} />

                                <Textarea label="Resources" name="required_resources_summary" value={form.required_resources_summary} onChange={handleChange} />

                            </Section>

                        </div>

                    )}

                    {/* ================= DOCUMENT TAB ================= */}
                    {activeTab === "documents" && (

                        <div className="space-y-4">

                            {documents.length === 0 && (
                                <p className="text-gray-500">No documents found</p>
                            )}

                            {documents.map((doc) => (

                                <div
                                    key={doc.id}
                                    className="border rounded-xl p-4 flex justify-between items-center"
                                >

                                    <div>
                                        <p className="font-medium">{doc.document_name}</p>
                                        <p className="text-sm text-gray-500">{doc.document_type}</p>
                                    </div>

                                    <div className="flex items-center gap-3">

                                        <a
                                            href={doc.file_path}
                                            target="_blank"
                                            className="text-purple-600 text-sm"
                                        >
                                            View
                                        </a>

                                        <label className="bg-gray-100 px-3 py-1 rounded cursor-pointer hover:bg-gray-200">
                                            Replace
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) =>
                                                    replaceDocument(doc.id, e.target.files[0])
                                                }
                                            />
                                        </label>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

                {/* FOOTER */}
                {activeTab === "proposal" && (
                    <div className="flex justify-end gap-3 p-5 border-t">

                        <button onClick={onClose} className="px-4 py-2 border rounded">
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="px-5 py-2 bg-purple-600 text-white rounded"
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
}


/* ================= COMPONENTS ================= */

function Tab({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 ${active
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-600"
                }`}
        >
            {label}
        </button>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">
                {title}
            </h3>
            <div className="grid grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );
}

function Input({ label, name, value, onChange }) {
    return (
        <div>
            <label className="text-sm text-gray-500">{label}</label>
            <input
                name={name}
                value={value || ""}
                onChange={onChange}
                className="w-full border p-2 rounded mt-1"
            />
        </div>
    );
}

function Textarea({ label, name, value, onChange }) {
    return (
        <div className="col-span-2">
            <label className="text-sm text-gray-500">{label}</label>
            <textarea
                name={name}
                value={value || ""}
                onChange={onChange}
                rows={3}
                className="w-full border p-2 rounded mt-1"
            />
        </div>
    );
}