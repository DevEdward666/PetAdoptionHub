import { useState } from "react";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import AdoptPet from "./adopt-pet";
import PetOwners from "./pet-owners";
import PetShowcase from "./pet-showcase";
import ReportCruelty from "./report-cruelty";

export default function Home() {
  const [activeTab, setActiveTab] = useState("adopt");

  return (
    <div className="pb-16">
      {/* Header */}
      <header className="sticky top-0 bg-white z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <i className="ri-paw-print-fill text-primary text-2xl mr-2"></i>
            <h1 className="font-['Nunito'] font-bold text-xl">PetPals</h1>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-[#F8F9FA]">
              <i className="ri-search-line text-xl text-[#343A40]"></i>
            </button>
            <button className="p-2 rounded-full hover:bg-[#F8F9FA] ml-1">
              <i className="ri-notification-3-line text-xl text-[#343A40]"></i>
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="relative border-b border-gray-200">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button 
              className={`px-4 py-3 font-['Nunito'] font-semibold whitespace-nowrap ${activeTab === "adopt" ? "text-primary" : "text-gray-500"}`}
              onClick={() => setActiveTab("adopt")}
            >
              Adopt a Pet
            </button>
            <button 
              className={`px-4 py-3 font-['Nunito'] font-semibold whitespace-nowrap ${activeTab === "owners" ? "text-primary" : "text-gray-500"}`}
              onClick={() => setActiveTab("owners")}
            >
              Pet Owners
            </button>
            <button 
              className={`px-4 py-3 font-['Nunito'] font-semibold whitespace-nowrap ${activeTab === "showcase" ? "text-primary" : "text-gray-500"}`}
              onClick={() => setActiveTab("showcase")}
            >
              Pet Showcase
            </button>
            <button 
              className={`px-4 py-3 font-['Nunito'] font-semibold whitespace-nowrap ${activeTab === "report" ? "text-primary" : "text-gray-500"}`}
              onClick={() => setActiveTab("report")}
            >
              Report Cruelty
            </button>
          </div>
          <div 
            className="absolute bottom-0 left-0 h-0.5 bg-primary transition-transform duration-300 ease-in-out" 
            style={{ 
              width: activeTab === "adopt" ? "100px" : 
                     activeTab === "owners" ? "95px" : 
                     activeTab === "showcase" ? "113px" : "120px",
              transform: `translateX(${
                activeTab === "adopt" ? 0 : 
                activeTab === "owners" ? 100 : 
                activeTab === "showcase" ? 195 : 308}px)` 
            }}
          ></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        {activeTab === "adopt" && <AdoptPet />}
        {activeTab === "owners" && <PetOwners />}
        {activeTab === "showcase" && <PetShowcase />}
        {activeTab === "report" && <ReportCruelty />}
      </main>

      <BottomNavigation />
      
      {/* Add custom styles for scrollbar hiding */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .pet-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .pet-card:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
