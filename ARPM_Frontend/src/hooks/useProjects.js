import { useEffect, useState } from "react";

export default function useProjects() {

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchProjects = async () => {

            try {

                const res = await fetch("http://127.0.0.1:8000/projects");

                if (!res.ok) {
                    throw new Error("Failed to fetch projects");
                }

                const data = await res.json();

                // Filter R&D projects
                const rndProjects = data.filter(
                    (project) => project.type === "R_D"
                );

                // If API returns empty → use dummy data
                if (rndProjects.length === 0) {
                    setProjects(dummyProjects);
                } else {
                    setProjects(rndProjects);
                }

            } catch (err) {

                // If API fails → use dummy data
                setProjects(dummyProjects);
                setError(null);

            } finally {

                setLoading(false);

            }

        };

        fetchProjects();

    }, []);

    return { projects, loading, error };
}


const dummyProjects = [
    {
        id: 1,
        title: "AI Crop Disease Detection",
        description: "Using deep learning to detect plant diseases from leaf images.",
        type: "R_D"
    },
    {
        id: 2,
        title: "Smart Irrigation System",
        description: "IoT based irrigation system for efficient water management.",
        type: "R_D"
    },
    {
        id: 3,
        title: "Autonomous Drone Monitoring",
        description: "Drone system to monitor agricultural fields automatically.",
        type: "R_D"
    }
];