import { useEffect, useState } from "react";
import ReviewList from "./ReviewList";
import PMReviewForm from "./PMReviewForm";
import StatusBadge from "./StatusBadge";

export default function PMReviewPanel({ proposal }) {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const canReview = proposal.status === "submitted_to_pm";

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

    const handleReviewSubmit = (newReview) => {
        setReviews([newReview, ...reviews]);
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">

                <h2 className="text-xl font-semibold text-gray-800">
                    Project Manager Review
                </h2>

                <StatusBadge status={proposal.status} />

            </div>

            {/* REVIEW FORM */}
            {canReview ? (
                <PMReviewForm
                    proposal={proposal}
                    onSubmit={handleReviewSubmit}
                />
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-700 text-sm">
                    You can only view reviews. Editing is disabled in current status.
                </div>
            )}

            {/* REVIEW LIST */}
            <ReviewList reviews={reviews} />

        </div>
    );
}