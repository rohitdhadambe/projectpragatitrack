import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill all fields");
            return;
        }

        try {

            const data = await login(email, password);

            if (data.role === "project_manager") navigate("/manager/home");
            else if (data.role === "reviewer") navigate("/reviewer/home");
            else if (data.role === "committee") navigate("/committee/home");
            else if (data.role === "lead_researcher") navigate("/researcher/home");

        } catch (err) {
            setError("Invalid email or password");
        }
    };


    return (
        <div>

            <div className="flex flex-wrap justify-center items-center min-h-screen bg-gray-100">

                <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-full md:w-[70%]">

                    {/* Left Image Section */}

                    <div className="hidden md:block md:w-1/2">
                        <img
                            className="object-cover w-full h-full"
                            src="https://images.pexels.com/photos/17485632/pexels-photo-17485632.png"
                            alt="Login Visual"
                        />
                    </div>


                    {/* Right Form Section */}

                    <div className="w-full md:w-1/2 p-8">

                        <div className="flex mb-8 justify-center">
                            <h1 className="text-3xl font-bold text-[#7ed957]">Pragati.</h1>
                            <h1 className="text-3xl font-bold text-gray-800">Track</h1>
                        </div>

                        <h2 className="text-center text-gray-600 mb-6">
                            Research Project Management Login
                        </h2>

                        {error && (
                            <p className="text-red-500 text-sm text-center mb-4">
                                {error}
                            </p>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>

                            {/* Email */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>


                            {/* Password with Eye Button */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>

                                <div className="relative mt-2">

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-gray-500"
                                    >
                                        {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                                    </button>

                                </div>
                            </div>


                            <button
                                type="submit"
                                className="w-full bg-purple-500 text-white font-semibold py-2 rounded-lg hover:bg-purple-600 transition duration-300"
                            >
                                Login
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;