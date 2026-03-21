import { useState } from "react";
import Inbox from "./Inbox";
import Sent from "./Sent";
import Compose from "./Compose";

export default function Communication() {
  const [activeTab, setActiveTab] = useState("inbox");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Communication</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab("inbox")} className="btn">Inbox</button>
        <button onClick={() => setActiveTab("sent")} className="btn">Sent</button>
        <button onClick={() => setActiveTab("compose")} className="btn">Compose</button>
      </div>

      {/* Content */}
      {activeTab === "inbox" && <Inbox />}
      {activeTab === "sent" && <Sent />}
      {activeTab === "compose" && <Compose />}
    </div>
  );
}