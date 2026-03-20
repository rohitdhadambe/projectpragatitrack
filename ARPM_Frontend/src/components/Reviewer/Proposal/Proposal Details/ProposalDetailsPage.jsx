import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TopNavBar from "../../../../layout/TopNavBar";
import SideNavBarInvestigator from "../../SideNavBar/SideNavBar";

import ProposalHeader from "./ProposalHeader";
import ProposalTabs from "./ProposalTabs";
import ProposalDetailsCard from "./ProposalDetailsCard";
import ProposalDocumentsCard from "./ProposalDocumentsCard";
import ProposalStatusCard from "./ProposalStatusCard";
import ReviewerTable from "./Reviewer/ReviewerTable";
import ReviewerReviewPanel from "./ReviewerReview/ReviewerReview";
export default function ReviewerProposalDetailsPage() {

    const { id } = useParams();

    const [proposal, setProposal] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [activeTab, setActiveTab] = useState("details");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchProposal();
        fetchDocuments();
    }, [id]);

    const fetchProposal = async () => {
        const res = await fetch(`http://127.0.0.1:8000/proposals/${id}`);
        const data = await res.json();
        setProposal(data);
    };

    const fetchDocuments = async () => {
        const res = await fetch(`http://127.0.0.1:8000/proposals/${id}/documents`);
        const data = await res.json();
        setDocuments(data);
    };
    const submitToPM = async () => {
        await fetch(`http://127.0.0.1:8000/proposals/${id}/submit`, {
            method: "POST"
        });
        fetchProposal();
    };

    if (!proposal) return <div>Loading...</div>;

    return (
        <div>

            <TopNavBar />

            <div className="min-h-screen flex bg-gray-100 pt-20">

                <SideNavBarInvestigator
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className={`flex-grow ${isSidebarOpen ? "ml-80" : "ml-16"}`}>

                    <div className="p-6">

                        <ProposalHeader
                            proposal={proposal}
                            onEdit={() => setShowEditModal(true)}
                        />

                        <ProposalTabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />

                        {activeTab === "details" && (
                            <ProposalDetailsCard proposal={proposal} />
                        )}

                        {activeTab === "documents" && (
                            <ProposalDocumentsCard documents={documents} />
                        )}

                        {activeTab === "status" && (
                            <ProposalStatusCard
                                proposal={proposal}
                                onSubmit={submitToPM}
                            />
                        )}


                        {activeTab === "reviewer" && (
                            <ReviewerTable
                                proposalId={id}

                            />
                        )}

                        {activeTab === "remark" && (
                            <ReviewerReviewPanel
                                proposal={proposal}

                            />
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}   