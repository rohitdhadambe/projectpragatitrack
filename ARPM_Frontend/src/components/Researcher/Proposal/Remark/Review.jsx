import { useEffect, useState } from "react";
import ReviewList from "./ReviewList";

export default function Review({ proposal }) {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const res = await fetch(
            `http://127.0.0.1:8000/proposal-reviews/${proposal.id}`
        );
        const data = await res.json();
        setReviews(data);
    };
    return (
        <div className="space-y-6">
            <ReviewList reviews={reviews} />
        </div>
    );
}