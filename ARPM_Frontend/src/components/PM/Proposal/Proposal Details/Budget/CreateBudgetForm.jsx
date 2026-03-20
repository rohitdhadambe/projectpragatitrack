import { useState } from "react";

export default function CreateBudgetForm({ proposal }) {

    const [form, setForm] = useState({
        total_budget: "",
        justification: "",
        compute_cost: "",
        data_acquisition_cost: "",
        manpower_cost: "",
        infrastructure_cost: "",
        miscellaneous_cost: "",
    });

    const [documents, setDocuments] = useState([
        { name: "", type: "", file: null }
    ]);

    const [loading, setLoading] = useState(false);

    // 🔥 Handle form
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔥 Document handlers
    const handleDocChange = (index, field, value) => {
        const updated = [...documents];
        updated[index][field] = value;
        setDocuments(updated);
    };

    const addDocument = () => {
        setDocuments([...documents, { name: "", type: "", file: null }]);
    };

    const removeDocument = (index) => {
        const updated = documents.filter((_, i) => i !== index);
        setDocuments(updated);
    };

    // 🔥 Submit
    const handleSubmit = async () => {

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("created_by", 1); // replace with auth user

            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });

            // 🔥 metadata
            const meta = documents.map(doc => ({
                name: doc.name,
                type: doc.type
            }));

            formData.append("document_meta", JSON.stringify(meta));

            // 🔥 files
            documents.forEach(doc => {
                if (doc.file) {
                    formData.append("files", doc.file);
                }
            });

            const res = await fetch(
                `http://127.0.0.1:8000/budget-proposals/${proposal.id}/budget`,
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!res.ok) {
                throw new Error("Failed to submit");
            }

            alert("✅ Budget submitted successfully");

        } catch (err) {
            alert("❌ Error submitting budget");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow space-y-6">

            <h2 className="text-xl font-semibold">
                Budget Proposal
            </h2>

            {/* Budget Fields */}
            <div className="grid grid-cols-2 gap-4">

                <input name="total_budget" placeholder="Total Budget" onChange={handleChange} className="input border p-2 rounded w-full" />

                <input name="compute_cost" placeholder="Compute Cost" onChange={handleChange} className="input border p-2 rounded w-full" />

                <input name="data_acquisition_cost" placeholder="Data Cost" onChange={handleChange} className="input border p-2 rounded w-full" />

                <input name="manpower_cost" placeholder="Manpower Cost" onChange={handleChange} className="input border p-2 rounded w-full" />

                <input name="infrastructure_cost" placeholder="Infra Cost" onChange={handleChange} className="input border p-2 rounded w-full" />

                <input name="miscellaneous_cost" placeholder="Misc Cost" onChange={handleChange} className="input border p-2 rounded w-full" />

            </div>

            <textarea
                name="justification"
                placeholder="Budget Justification"
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            {/* DOCUMENTS */}
            <div>

                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Documents</h3>

                    <button
                        onClick={addDocument}
                        className="bg-purple-500 text-white px-3 py-1 rounded"
                    >
                        + Add Document
                    </button>
                </div>

                {documents.map((doc, index) => (
                    <div key={index} className="border p-4 mt-3 rounded space-y-2">

                        <div className="grid grid-cols-3 gap-3">

                            <input
                                placeholder="Document Name"
                                value={doc.name}
                                onChange={(e) =>
                                    handleDocChange(index, "name", e.target.value)
                                }
                                className="input border p-2 rounded w-full"
                            />

                            <input
                                placeholder="Document Type"
                                value={doc.type}
                                onChange={(e) =>
                                    handleDocChange(index, "type", e.target.value)
                                }
                                className="input border p-2 rounded w-full"
                            />

                            <input
                                className="border p-2 rounded w-full"
                                type="file"
                                onChange={(e) =>
                                    handleDocChange(index, "file", e.target.files[0])
                                }
                            />

                        </div>

                        <button
                            onClick={() => removeDocument(index)}
                            className="text-red-500 text-sm"
                        >
                            Remove
                        </button>

                    </div>
                ))}

            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded"
            >
                {loading ? "Submitting..." : "Submit Budget"}
            </button>

        </div>
    );
}