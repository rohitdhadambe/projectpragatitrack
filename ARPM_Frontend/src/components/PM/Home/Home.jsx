import { useState, useEffect } from "react";
import SideNavBarInvestigator from "../SideNavBar/SideNavBar";
import TopNavBar from "../../../layout/TopNavBar";
import { useAuth } from "../../context/AuthContext";

export default function PMHome() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [eligibleProposals, setEligibleProposals] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [formState, setFormState] = useState({
        proposal_id: "",
        title: "",
        description: "",
        research_plan: "",
        technical_design: "",
        data_strategy: "",
        resource_plan: "",
        timeline: "",
        risk_management: "",
    });
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [projectsError, setProjectsError] = useState(null);

    const fetchProjects = async () => {
        if (!user || user.role !== "project_manager") {
            setProjects([]);
            setLoadingProjects(false);
            return;
        }

        const pmId = user.id ?? user.user_id;
        if (!pmId) {
            setProjects([]);
            setProjectsError("Missing user ID");
            setLoadingProjects(false);
            return;
        }

        setLoadingProjects(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/projects/pm/${pmId}`);
           
            const data = await res.json();
            setProjects(data);
            setProjectsError(null);
        } catch (err) {
            setProjects([]);
            setProjectsError("Unable to load projects");
        } finally {
            setLoadingProjects(false);
        }
    };

    useEffect(() => {
        if (user && user.role === "project_manager") {
            fetchProjects();
        }
    }, [user]);

    useEffect(() => {
        if (!user || user.role !== "project_manager") return;

        const pmId = user.id ?? user.user_id;
        if (!pmId) return;

        const fetchEligible = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/projects/eligible-proposals/${pmId}`);
                if (!res.ok) throw new Error("Failed to load eligible proposals");
                const data = await res.json();
                setEligibleProposals(data);
            } catch (err) {
                setEligibleProposals([]);
            }
        };

        fetchEligible();
    }, [user]);

    const handleInput = (key, value) => {
        setFormState((prev) => ({ ...prev, [key]: value }));
    };

    const normalizeSection = (text) =>
        text
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

    const handleSubmit = async () => {
        if (!user || user.role !== "project_manager") {
            setFormError("Invalid user");
            return;
        }

        if (!formState.proposal_id) {
            setFormError("Please select a proposal.");
            return;
        }

        const payload = {
            proposal_id: Number(formState.proposal_id),
            project_manager_id: user.id,
            title: formState.title,
            description: formState.description,
            project_details: {
                research_plan: normalizeSection(formState.research_plan),
                technical_design: normalizeSection(formState.technical_design),
                data_strategy: normalizeSection(formState.data_strategy),
                resource_plan: normalizeSection(formState.resource_plan),
                timeline: normalizeSection(formState.timeline),
                risk_management: normalizeSection(formState.risk_management),
            },
            status: "planned",
        };

        try {
            const res = await fetch("http://127.0.0.1:8000/projects/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Failed to create project");
            }

            setFormSuccess("Project created successfully.");
            setFormError(null);
            setShowCreate(false);
            setFormState({
                proposal_id: "",
                title: "",
                description: "",
                research_plan: "",
                technical_design: "",
                data_strategy: "",
                resource_plan: "",
                timeline: "",
                risk_management: "",
            });
            await fetchProjects();
            const pmId = user.id ?? user.user_id;
            if (pmId) {
                const eligibleRes = await fetch(`http://127.0.0.1:8000/projects/eligible-proposals/${pmId}`);
                if (eligibleRes.ok) setEligibleProposals(await eligibleRes.json());
            }
        } catch (err) {
            setFormError(err.message || "Error creating project");
            setFormSuccess(null);
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

                <div
                    className={`flex flex-col grow transition-all duration-300
                    ${isSidebarOpen ? "ml-80" : "ml-16"}`}
                >

                    <div className="p-6">

                        <h1 className="text-2xl font-bold mb-6">
                            Welcome to Pragati.Track
                        </h1>

                        <div className="bg-white rounded-xl shadow-md p-6">

                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Your Projects</h2>
                                {user && user.role === "project_manager" && (
                                    <button
                                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                                        onClick={() => setShowCreate(true)}
                                    >
                                        + Create Project
                                    </button>
                                )}
                            </div>

                            {loadingProjects && (
                                <p className="text-gray-500">Loading projects...</p>
                            )}

                            {projectsError && (
                                <p className="text-red-500">{projectsError}</p>
                            )}

                            {!loadingProjects && !projectsError && projects.length === 0 && (
                                <p className="text-gray-500">No projects found (or none assigned).</p>
                            )}

                            {!loadingProjects && !projectsError && projects.length > 0 && (
                                <div className="space-y-4">
                                    {projects.map((project) => (
                                        <div key={project.id} className="p-4 border rounded-lg shadow-sm">
                                            <h3 className="font-semibold text-lg">{project.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">Status: {project.status}</p>
                                            <p className="text-gray-600 text-sm">{project.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {showCreate && (
                                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                                    <div className="bg-white w-[90vw] md:w-[80vw] lg:w-[60vw] p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
                                        <h3 className="text-xl font-bold mb-3">Create Project</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            <label className="block">
                                                Eligible Proposal
                                                <select
                                                    className="w-full border p-2 rounded"
                                                    value={formState.proposal_id}
                                                    onChange={(e) => handleInput("proposal_id", e.target.value)}
                                                >
                                                    <option value="">Select a proposal</option>
                                                    {eligibleProposals.map((proposal) => (
                                                        <option key={proposal.id} value={proposal.id}>
                                                            {proposal.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>

                                            <label className="block">
                                                Project Title
                                                <input
                                                    className="w-full border p-2 rounded"
                                                    value={formState.title}
                                                    onChange={(e) => handleInput("title", e.target.value)}
                                                    placeholder="Project title"
                                                />
                                            </label>

                                            <label className="block md:col-span-2">
                                                Project Description
                                                <textarea
                                                    className="w-full border p-2 rounded"
                                                    value={formState.description}
                                                    onChange={(e) => handleInput("description", e.target.value)}
                                                    placeholder="Short project description"
                                                    rows={3}
                                                />
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            <label className="block">
                                                Research Plan (line separated)
                                                <textarea
                                                    className="w-full border p-2 rounded"
                                                    value={formState.research_plan}
                                                    onChange={(e) => handleInput("research_plan", e.target.value)}
                                                    rows={3}
                                                />
                                            </label>
                                            <label className="block">
                                                Technical Design (line separated)
                                                <textarea
                                                    className="w-full border p-2 rounded"
                                                    value={formState.technical_design}
                                                    onChange={(e) => handleInput("technical_design", e.target.value)}
                                                    rows={3}
                                                />
                                            </label>
                                            <label className="block">
                                                Data Strategy (line separated)
                                                <textarea
                                                    className="w-full border p-2 rounded"
                                                    value={formState.data_strategy}
                                                    onChange={(e) => handleInput("data_strategy", e.target.value)}
                                                    rows={3}
                                                />
                                            </label>
                                            <label className="block">
                                                Resource Plan (line separated)
                                                <textarea
                                                    className="w-full border p-2 rounded"
                                                    value={formState.resource_plan}
                                                    onChange={(e) => handleInput("resource_plan", e.target.value)}
                                                    rows={3}
                                                />
                                            </label>
                                            <label className="block">
                                                Timeline (line separated)
                                                <textarea
                                                    className="w-full border p-2 rounded"
                                                    value={formState.timeline}
                                                    onChange={(e) => handleInput("timeline", e.target.value)}
                                                    rows={3}
                                                />
                                            </label>
                                            <label className="block">
                                                Risk Management (line separated)
                                                <textarea
                                                    className="w-full border p-2 rounded"
                                                    value={formState.risk_management}
                                                    onChange={(e) => handleInput("risk_management", e.target.value)}
                                                    rows={3}
                                                />
                                            </label>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="px-4 py-2 border rounded"
                                                onClick={() => setShowCreate(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                                                onClick={handleSubmit}
                                            >
                                                Save Project
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}