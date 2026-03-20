export default function ProposalDocumentsTab({ documents, editMode }) {

    const replaceDocument = async (id, file) => {

        const formData = new FormData();
        formData.append("file", file);

        await fetch(`http://127.0.0.1:8000/proposals/documents/${id}/replace`, {
            method: "PUT",
            body: formData
        });

        window.location.reload();
    };

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
                Proposal Documents
            </h2>

            {documents.map((doc) => (

                <div
                    key={doc.id}
                    className="border p-3 rounded flex justify-between"
                >

                    <div>
                        <p>{doc.document_name}</p>
                        <p className="text-gray-500 text-sm">{doc.document_type}</p>
                    </div>

                    <div className="flex gap-3">

                        <a
                            href={doc.file_path}
                            target="_blank"
                            className="text-purple-600"
                        >
                            View
                        </a>

                        {editMode && (
                            <input
                                type="file"
                                onChange={(e) =>
                                    replaceDocument(doc.id, e.target.files[0])
                                }
                            />
                        )}

                    </div>

                </div>

            ))}

        </div>
    );
}