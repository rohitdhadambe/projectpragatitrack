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
          setIsSidebarOpen={() => { }}
        />

        <div className="flex flex-col flex-grow transition-all duration-300 ml-80">
          <CommunicationContent activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}

function CommunicationContent({ activeTab, setActiveTab }) {
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