import { useState } from "react";
import ReviewCard from "./ReviewCard";
export default function ReviewList({ reviews }) {

    if (reviews.length === 0) {
        return (
            <div className="text-gray-500 text-sm">
                No reviews yet
            </div>
        );
    }

    return (
        <div className="space-y-4">

            {reviews.map((review) => (
                <ReviewCard review={review} />
            ))}

        </div>
    );
}