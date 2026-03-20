import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StepDocumentUpload({ proposalId, userId }) {

    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);

    const [documents, setDocuments] = useState([
        { name: "Detailed Proposal PDF", type: "proposal_pdf", file: null },
        { name: "Literature Review", type: "literature_review", file: null },
        { name: "Methodology Architecture", type: "architecture", file: null },
        { name: "Dataset Description", type: "dataset_info", file: null },
        { name: "Budget Breakdown", type: "budget_sheet", file: null }
    ]);

    const handleFileChange = (index, file) => {
        const updated = [...documents];
        updated[index].file = file;
        setDocuments(updated);
    };

    const uploadDocuments = async () => {

        if (!proposalId) {
            alert("Proposal ID missing ❌");
            return;
        }

        setUploading(true);

        try {

            for (const doc of documents) {

                if (!doc.file) continue;

                const formData = new FormData();

                formData.append("proposal_id", proposalId);
                formData.append("document_name", doc.name);
                formData.append("document_type", doc.type);
                formData.append("uploaded_by", userId);
                formData.append("file", doc.file);

                const res = await fetch(
                    "http://127.0.0.1:8000/proposals/upload-document",
                    {
                        method: "POST",
                        body: formData
                    }
                );

                if (!res.ok) {
                    const err = await res.json();
                    console.error("Upload error:", err);
                    throw new Error(err.detail || "Upload failed");
                }
            }

            alert("✅ Documents uploaded successfully");
            navigate("/researcher/proposals");

        } catch (err) {
            console.error(err);
            alert("❌ Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">

            <h2 className="text-lg font-semibold">
                Upload Proposal Documents
            </h2>

            {documents.map((doc, index) => (
                <div key={index} className="border rounded-lg p-4">

                    <label className="block mb-2 font-medium">
                        {doc.name}
                    </label>

                    <input
                        type="file"
                        onChange={(e) =>
                            handleFileChange(index, e.target.files[0])
                        }
                        className="w-full"
                    />

                </div>
            ))}

            <button
                onClick={uploadDocuments}
                disabled={uploading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
                {uploading ? "Uploading..." : "Upload Documents"}
            </button>

        </div>
    );
}