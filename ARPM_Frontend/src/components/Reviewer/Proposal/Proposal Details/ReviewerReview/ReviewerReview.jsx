import { use, useEffect, useState } from "react";
import ReviewList from "./ReviewList";
import ReviewerReviewForm from "./ReviewerReviewForm";
import StatusBadge from "./StatusBadge";
import { useAuth } from "../../../../context/AuthContext";

export default function ReviewerReviewPanel({ proposal }) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ UPDATED CONDITION
    const canReview = proposal.status === "submitted_to_reviewers";

    useEffect(() => {
        if (proposal?.id) {
            fetchReviews();
        }
    }, [proposal]);

    const fetchReviews = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `http://127.0.0.1:8000/proposal-reviews/${proposal.id}`
            );

            const data = await res.json();
            setReviews(data);

        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = (newReview) => {
        setReviews([newReview, ...reviews]);
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">

                <h2 className="text-xl font-semibold text-gray-800">
                    Reviewer Evaluation
                </h2>

                <StatusBadge status={proposal.status} />

            </div>

            {/* ================= FORM / LOCK ================= */}

            {canReview ? (
                <ReviewerReviewForm
                    proposal={proposal}
                    onSubmit={handleReviewSubmit}
                    user={user}
                />
            ) : (
                <div className="bg-gray-50 border p-4 rounded-lg text-gray-600 text-sm">
                    🚫 Review form is locked. You can only view submitted reviews.
                </div>
            )}

            {/* ================= LOADING ================= */}

            {loading ? (
                <p className="text-gray-500">Loading reviews...</p>
            ) : (
                <ReviewList reviews={reviews} />
            )}

        </div>
    );
}