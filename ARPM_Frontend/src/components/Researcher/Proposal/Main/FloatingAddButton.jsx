import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function FloatingAddButton() {

    return (
        <Link to="/researcher/create/proposal" >
            <button
                className="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700"
            >
                <FaPlus />
            </button>
        </Link>

    );
}