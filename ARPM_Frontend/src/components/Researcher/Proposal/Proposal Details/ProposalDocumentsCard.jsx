export default function ProposalDocumentsCard({ documents }) {

    return (
        <div className="bg-white p-6 rounded shadow">

            {documents.map((doc) => (

                <div key={doc.id} className="border p-3 mb-2 flex justify-between">

                    <div>
                        <p>{doc.document_name}</p>
                        <p className="text-sm text-gray-500">{doc.document_type}</p>
                    </div>

                    <a href={doc.file_path} target="_blank">
                        View
                    </a>

                </div>

            ))}

        </div>
    );
}