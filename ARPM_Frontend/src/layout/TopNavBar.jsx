import { useAuth } from "../components/context/AuthContext";
// import { FaBell } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

export default function TopNavBar() {

    const { user, logout } = useAuth();
    console.log("user :", user)
    return (
        <div className="fixed top-0 left-0 right-0 h-20 bg-white border-b shadow-sm flex items-center justify-between px-8 z-50">

            {/* Left */}
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-purple-600">
                    ARPM
                </h1>

                <span className="hidden lg:block text-gray-500 text-sm">
                    AI Research Project Management
                </span>
            </div>

            {/* Search */}
            <div className="hidden md:flex w-[400px]">
                <input
                    type="text"
                    placeholder="Search projects, researchers..."
                    className="w-full px-4 py-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">

                {/* Notification */}
                {/* <button className="relative text-gray-600 hover:text-purple-600">
                    <FaBell size={20} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                        3
                    </span>
                </button> */}

                {/* Avatar */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                        {user?.role?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="hidden md:block">
                        <p className="text-sm font-semibold">
                            {user?.role || "Researcher"}
                        </p>
                        <p className="text-xs text-gray-500">
                            Logged In
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600"
                >
                    <FiLogOut />
                    <span className="hidden md:block text-sm">Logout</span>
                </button>

            </div>

        </div>
    );
}