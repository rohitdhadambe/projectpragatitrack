function StatusBadge({ status }) {

    const styles = {
        submitted_to_pm: "bg-blue-100 text-blue-700",
        submitted_to_reviewers: "bg-purple-100 text-purple-700",
        review_completed: "bg-green-100 text-green-700",
        approved: "bg-green-200 text-green-900",
        rejected: "bg-red-100 text-red-700"
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100"}`}>
            {status}
        </span>
    );
}
export default StatusBadge;