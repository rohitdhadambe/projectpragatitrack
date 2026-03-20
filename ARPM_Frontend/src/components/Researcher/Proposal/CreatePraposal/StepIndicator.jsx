export default function StepIndicator({ step }) {

    const steps = [
        "Basic Info",
        "Research Details",
        "Project Planning",
        "Upload Documents"
    ];

    return (

        <div className="flex gap-3 mb-8">

            {steps.map((title, index) => {

                const s = index + 1;

                return (

                    <div
                        key={s}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold
                        ${step === s ? "bg-purple-600 text-white" : "bg-gray-200"}`}
                    >
                        {title}
                    </div>

                );

            })}

        </div>

    );
}