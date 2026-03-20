import { useState, useEffect } from "react";
import { FaColumns } from "react-icons/fa";

export default function ColumnManager({ visibleColumns, setVisibleColumns }) {

    const [open, setOpen] = useState(false);

    // temporary columns before applying
    const [tempColumns, setTempColumns] = useState([]);

    useEffect(() => {
        setTempColumns(visibleColumns);
    }, [visibleColumns]);

    const allColumns = [
        "title",
        "lead_researcher_id",
        "research_domain",
        "assigned_pm_id",
        "abstract",
        "problem_statement",
        "motivation",
        "objectives",
        "methodology_overview",
        "novelty",
        "expected_outcomes",
        "potential_impact",
        "proposed_duration_months",
        "rough_budget_estimate",
        "team_size_estimate",
        "required_resources_summary",
        "status"
    ];

    const toggleColumn = (col) => {

        if (tempColumns.includes(col)) {
            setTempColumns(tempColumns.filter(c => c !== col));
        } else {
            setTempColumns([...tempColumns, col]);
        }

    };

    const applyChanges = () => {
        setVisibleColumns(tempColumns);
        setOpen(false);
    };

    return (
        <div className="relative">

            {/* SAME BUTTON UI */}
            <button
                onClick={() => setOpen(!open)}
                className="p-3 rounded-lg hover:bg-gray-100 transition"
                title="Column Manager"
            >
                <FaColumns size={18} />
            </button>

            {/* POPUP */}
            {open && (

                <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-xl p-4 border z-50">

                    <h3 className="font-semibold mb-3 text-gray-700">
                        Column Manager
                    </h3>

                    <div className="max-h-64 overflow-y-auto">

                        {allColumns.map(col => (

                            <label
                                key={col}
                                className="flex items-center gap-2 py-1 text-sm cursor-pointer"
                            >

                                <input
                                    type="checkbox"
                                    checked={tempColumns.includes(col)}
                                    onChange={() => toggleColumn(col)}
                                />

                                {col.replaceAll("_", " ")}

                            </label>

                        ))}

                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex justify-end gap-2 mt-4">

                        <button
                            onClick={() => setOpen(false)}
                            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={applyChanges}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Apply
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}