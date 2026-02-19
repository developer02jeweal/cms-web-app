import { useState } from "react";
import SideNav from "@/components/SideNav";
import Companies from "@/pages/companies/Companies";
import Programs from "@/pages/programs/Programs";
import Instances from "@/pages/instances/Instances";

export default function Home() {
    const [activeTab, setActiveTab] = useState("Companies");

    const renderContent = () => {
        switch (activeTab) {
            case "Companies":
                return <Companies />;

            case "Programs":
                return <Programs />

            case "Instances":
                return <Instances />

            default:
                return <Companies />;
        }
    };

    return (
        <div className="flex">

            {/* Sidebar */}
            <SideNav active={activeTab} setActive={setActiveTab} />

            {/* Main Content */}
            <div className="flex-1 min-h-screen bg-gray-50 p-8 overflow-auto">
                {renderContent()}
            </div>

        </div>
    );
}
