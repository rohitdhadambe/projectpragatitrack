import { useState } from "react";
import SideNavBarInvestigator from "../SideNavBar/SideNavBar";
import useProjects from "../../../hooks/useProjects";
import TopNavBar from "../../../layout/TopNavBar";

export default function ReviewerHome() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const { projects, loading, error } = useProjects();

    return (
        <div>

            <TopNavBar />

            <div className="min-h-screen flex bg-gray-100 pt-20">

                <SideNavBarInvestigator
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <div
                    className={`flex flex-col flex-grow transition-all duration-300
                    ${isSidebarOpen ? "ml-80" : "ml-16"}`}
                >

                    <div className="p-6">

                        <h1 className="text-2xl font-bold mb-6">
                            Welcome to Pragati.Track
                        </h1>

                        <div className="bg-white rounded-xl shadow-md p-6">

                            {loading && (
                                <p className="text-gray-500">Loading projects...</p>
                            )}

                            {error && (
                                <p className="text-red-500">{error}</p>
                            )}

                            {!loading && !error && (
                                <div className="space-y-4">

                                    {projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="p-4 border rounded-lg shadow-sm"
                                        >
                                            <h3 className="font-semibold text-lg">
                                                {project.title}
                                            </h3>

                                            <p className="text-gray-600 text-sm">
                                                {project.description}
                                            </p>
                                        </div>
                                    ))}

                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}