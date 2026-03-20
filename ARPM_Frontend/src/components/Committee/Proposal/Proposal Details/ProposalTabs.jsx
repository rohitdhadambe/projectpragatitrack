export default function ProposalTabs({ activeTab, setActiveTab }) {

    const tabs = ["details", "documents", "remark", "reviewer"];

    return (
        <div className="flex gap-6 border-b mb-6">

            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 capitalize ${activeTab === tab
                        ? "border-b-2 border-purple-600 text-purple-600"
                        : "text-gray-600"
                        }`}
                >
                    {tab}
                </button>
            ))}

        </div>
    );
}