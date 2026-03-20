export default function ProposalTabs({ activeTab, setActiveTab, proposal }) {

    const baseTabs = ["details", "documents", "remark", "reviewer"];

    // ✅ Add conditional tabs
    const conditionalTabs = [];

    if (proposal?.status === "approved") {
        conditionalTabs.push("budget");
    }

    const tabs = [...baseTabs, ...conditionalTabs];

    return (
        <div className="flex gap-6 border-b mb-6">

            {tabs.map((tab) => (

                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 capitalize transition-all duration-200 ${activeTab === tab
                        ? "border-b-2 border-purple-600 text-purple-600 font-medium"
                        : "text-gray-500 hover:text-purple-500"
                        }`}
                >
                    {formatLabel(tab)}
                </button>

            ))}

        </div>
    );
}

/* Helper */
function formatLabel(tab) {
    return tab.replace("_", " ");
}