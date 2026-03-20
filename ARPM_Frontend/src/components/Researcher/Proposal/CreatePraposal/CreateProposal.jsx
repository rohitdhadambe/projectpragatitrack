import { useState, useEffect } from "react";
import TopNavBar from "../../../../layout/TopNavBar";
import SideNavBarInvestigator from "../../SideNavBar/SideNavBar";
import { useAuth } from "../../../context/AuthContext";
import StepIndicator from "./StepIndicator";
import StepDocumentUpload from "./StepDocumentUpload";

export default function CreateProposalPage() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    const [proposalId, setProposalId] = useState(null);

    // 🔥 PM USERS STATE
    const [pmUsers, setPmUsers] = useState([]);
    const [selectedPM, setSelectedPM] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        research_domain: "",
        abstract: "",
        problem_statement: "",
        motivation: "",
        objectives: "",
        methodology_overview: "",
        novelty: "",
        expected_outcomes: "",
        potential_impact: "",
        proposed_duration_months: "",
        rough_budget_estimate: "",
        team_size_estimate: "",
        required_resources_summary: ""
    });

    // 🔥 FETCH PM USERS
    useEffect(() => {
        fetchPMUsers();
    }, []);

    const fetchPMUsers = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/users/");
            const data = await res.json();

            // 🔥 filter project managers
            const pmList = data.filter(
                (u) => u.role === "project_manager"
            );

            setPmUsers(pmList);

        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateStep = () => {

        if (step === 1) {
            return formData.title && formData.research_domain;
        }

        if (step === 2) {
            return (
                formData.abstract &&
                formData.problem_statement &&
                formData.motivation &&
                formData.objectives &&
                formData.methodology_overview &&
                formData.novelty
            );
        }

        if (step === 3) {
            return (
                formData.expected_outcomes &&
                formData.potential_impact &&
                formData.proposed_duration_months &&
                formData.rough_budget_estimate &&
                formData.team_size_estimate &&
                formData.required_resources_summary &&
                selectedPM // 🔥 ensure PM selected
            );
        }

        return true;
    };

    const nextStep = () => {

        if (!validateStep()) {
            alert("Please fill all required fields before continuing.");
            return;
        }

        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    // 🔥 SUBMIT PROPOSAL
    const handleSubmitProposal = async () => {

        if (loading) return;

        setLoading(true);

        try {

            const payload = {
                ...formData,
                lead_researcher_id: user.user_id,
                assigned_pm_id: parseInt(selectedPM) // 🔥 IMPORTANT
            };

            console.log("Payload:", payload);

            const response = await fetch(
                "http://127.0.0.1:8000/proposals/",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                const err = await response.json();
                console.error(err);
                throw new Error(err.detail || "Failed");
            }

            const data = await response.json();

            console.log("Created Proposal:", data);

            setProposalId(data.id);
            setStep(4);

        } catch (err) {

            console.error(err);
            alert("❌ Error creating proposal");

        } finally {

            setLoading(false);

        }
    };

    return (

        <div>

            <TopNavBar />

            <div className="min-h-screen flex bg-gray-100 pt-20">

                <SideNavBarInvestigator
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div className={`flex flex-col flex-grow ${isSidebarOpen ? "ml-80" : "ml-16"}`}>

                    <div className="p-8 max-w-5xl">

                        <h1 className="text-3xl font-bold mb-6">
                            Create Research Proposal
                        </h1>

                        <div className="bg-white rounded-xl shadow-md p-8">

                            <StepIndicator step={step} />

                            {/* STEP 1 */}
                            {step === 1 && (
                                <div className="space-y-5">

                                    <h2 className="text-lg font-semibold">
                                        Basic Proposal Info
                                    </h2>

                                    <input
                                        name="title"
                                        placeholder="Proposal Title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full border p-3 rounded-lg"
                                    />

                                    <input
                                        name="research_domain"
                                        placeholder="Research Domain"
                                        value={formData.research_domain}
                                        onChange={handleChange}
                                        className="w-full border p-3 rounded-lg"
                                    />

                                </div>
                            )}

                            {/* STEP 2 */}
                            {step === 2 && (
                                <div className="space-y-5">

                                    <h2 className="text-lg font-semibold">
                                        Research Details
                                    </h2>

                                    {[
                                        "abstract",
                                        "problem_statement",
                                        "motivation",
                                        "objectives",
                                        "methodology_overview",
                                        "novelty"
                                    ].map(field => (
                                        <textarea
                                            key={field}
                                            name={field}
                                            placeholder={field.replaceAll("_", " ")}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            className="w-full border p-3 rounded-lg"
                                        />
                                    ))}

                                </div>
                            )}

                            {/* STEP 3 */}
                            {step === 3 && (
                                <div className="space-y-5">

                                    <h2 className="text-lg font-semibold">
                                        Project Planning
                                    </h2>

                                    {[
                                        "expected_outcomes",
                                        "potential_impact",
                                        "required_resources_summary"
                                    ].map(field => (
                                        <textarea
                                            key={field}
                                            name={field}
                                            placeholder={field.replaceAll("_", " ")}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            className="w-full border p-3 rounded-lg"
                                        />
                                    ))}

                                    <input
                                        name="proposed_duration_months"
                                        placeholder="Duration (Months)"
                                        value={formData.proposed_duration_months}
                                        onChange={handleChange}
                                        className="w-full border p-3 rounded-lg"
                                    />

                                    <input
                                        name="rough_budget_estimate"
                                        placeholder="Budget Estimate"
                                        value={formData.rough_budget_estimate}
                                        onChange={handleChange}
                                        className="w-full border p-3 rounded-lg"
                                    />

                                    <input
                                        name="team_size_estimate"
                                        placeholder="Team Size"
                                        value={formData.team_size_estimate}
                                        onChange={handleChange}
                                        className="w-full border p-3 rounded-lg"
                                    />

                                    {/* 🔥 PM DROPDOWN */}
                                    <div>
                                        <label className="block mb-2 font-medium">
                                            Assign Project Manager
                                        </label>

                                        <select
                                            value={selectedPM}
                                            onChange={(e) => setSelectedPM(e.target.value)}
                                            className="w-full border p-3 rounded-lg"
                                        >
                                            <option value="">Select PM</option>

                                            {pmUsers.map(pm => (
                                                <option key={pm.id} value={pm.id}>
                                                    {pm.email}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>
                            )}

                            {/* STEP 4 */}
                            {step === 4 && (
                                <StepDocumentUpload
                                    proposalId={proposalId}
                                    userId={user.user_id}
                                />
                            )}

                            {/* BUTTONS */}
                            {step <= 3 && (
                                <div className="flex justify-between mt-8">

                                    {step > 1 && (
                                        <button
                                            onClick={prevStep}
                                            className="px-4 py-2 bg-gray-300 rounded-lg"
                                        >
                                            Back
                                        </button>
                                    )}

                                    {step < 3 && (
                                        <button
                                            onClick={nextStep}
                                            className="px-6 py-2 bg-purple-600 text-white rounded-lg"
                                        >
                                            Next
                                        </button>
                                    )}

                                    {step === 3 && (
                                        <button
                                            onClick={handleSubmitProposal}
                                            disabled={loading}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg"
                                        >
                                            {loading ? "Creating..." : "Create Proposal"}
                                        </button>
                                    )}

                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}