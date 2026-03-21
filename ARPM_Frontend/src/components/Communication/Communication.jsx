import { useState } from "react";
import Inbox from "./Inbox";
import Sent from "./Sent";
import Compose from "./Compose";
import SideNavBarInvestigator from "../Communication/SideNavBar/SideNavBar";
import TopNavBar from "../../layout/TopNavBar";

export default function Communication() {
  const [activeTab, setActiveTab] = useState("inbox");

  return (
    <div>
      <TopNavBar />

      <div className="min-h-screen flex bg-gray-100 pt-20">

        <SideNavBarInvestigator
          isSidebarOpen={true}
          setIsSidebarOpen={() => {}}
        />

        <div className="flex flex-col flex-grow transition-all duration-300 ml-80">
          <CommunicationContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
}

function CommunicationContent({ activeTab, setActiveTab }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
       Official Communication
      </h1>

      {/* 🔥 Tabs */}
      <div className="flex gap-3 mb-6">

        <button
          onClick={() => setActiveTab("inbox")}
          className={`px-4 py-2 rounded-lg font-medium transition
            ${activeTab === "inbox"
              ? "bg-purple-500 text-white shadow-md"
              : "bg-white text-gray-600 border hover:bg-purple-50"}
          `}
        >
          Inbox
        </button>

        <button
          onClick={() => setActiveTab("sent")}
          className={`px-4 py-2 rounded-lg font-medium transition
            ${activeTab === "sent"
              ? "bg-purple-500 text-white shadow-md"
              : "bg-white text-gray-600 border hover:bg-purple-50"}
          `}
        >
          Sent
        </button>

        <button
          onClick={() => setActiveTab("compose")}
          className={`px-4 py-2 rounded-lg font-medium transition
            ${activeTab === "compose"
              ? "bg-purple-500 text-white shadow-md"
              : "bg-white text-gray-600 border hover:bg-purple-50"}
          `}
        >
          Compose
        </button>

      </div>

      {/* 📦 Content */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        {activeTab === "inbox" && <Inbox />}
        {activeTab === "sent" && <Sent />}
        {activeTab === "compose" && <Compose />}
      </div>
    </div>
  );
}