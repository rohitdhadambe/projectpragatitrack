import { useState } from "react";
import TopNavBar from "../../../../layout/TopNavBar";
import SideNavBarInvestigator from "../../SideNavBar/SideNavBar";

import useProposals from "../../../../hooks/useProposals";

import ProposalTable from "./ProposalTable";
import ColumnManager from "./ColumnManager";
import FloatingAddButton from "./FloatingAddButton";


export default function ProposalPage() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const { proposals, loading, error } = useProposals();

    const [visibleColumns, setVisibleColumns] = useState([
        "title",
        "research_domain",
        "assigned_pm_id",
        "novelty",
        "proposed_duration_months",
        "status"
    ]);

    return (

        <div className="bg-gray-100 min-h-screen">

            {/* Top Navbar */}
            <TopNavBar />

            <div className="flex pt-20">

                {/* Sidebar */}
                <SideNavBarInvestigator
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                {/* Main Content */}
                <div
                    className={`flex flex-col flex-grow transition-all duration-300 ${isSidebarOpen ? "ml-80" : "ml-16"
                        }`}
                >

                    <div className="p-6">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">

                            <h1 className="text-2xl font-bold">
                                Research Proposals
                            </h1>

                            <ColumnManager
                                visibleColumns={visibleColumns}
                                setVisibleColumns={setVisibleColumns}
                            />

                        </div>

                        {/* Table Container */}
                        <div className="bg-white rounded-xl shadow-md p-6 w-full">

                            {loading && (
                                <p className="text-gray-500">Loading proposals...</p>
                            )}

                            {error && (
                                <p className="text-red-500">{error}</p>
                            )}

                            {!loading && !error && (
                                <ProposalTable
                                    proposals={proposals}
                                    visibleColumns={visibleColumns}
                                />
                            )}

                        </div>

                    </div>

                </div>

            </div>

            {/* Floating Add Button */}
            <FloatingAddButton />

        </div>
    );
}