"use client";

import Header from '@/components/Header';

export default function QuestManagementPage() {
  return (
    <div className="min-h-screen bg-[#0A3E45] text-white font-sans">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <a href="/Admin" className="text-yellow-400 hover:text-yellow-300 mr-4">← Back to Dashboard</a>
          <h1 className="text-3xl font-bold text-yellow-400">Quest Event Management</h1>
        </div>

        <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg">
          <div className="grid gap-6">
            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Active Quests</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <div className="flex justify-between items-center mb-4">
                  <input 
                    type="text" 
                    placeholder="Search active quests..." 
                    className="bg-[#0A3E45] text-white px-4 py-2 rounded w-64"
                  />
                  <button className="bg-[#AB8F3D] text-black px-4 py-2 rounded hover:bg-[#E3B051] transition-colors">
                    Monitor Quest
                  </button>
                </div>
                <p className="text-gray-300">No active quests found</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Quest Analytics</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#0A3E45] rounded">
                    <h3 className="text-yellow-400 mb-2">Total Participants</h3>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <div className="p-4 bg-[#0A3E45] rounded">
                    <h3 className="text-yellow-400 mb-2">Completion Rate</h3>
                    <p className="text-2xl font-bold">0%</p>
                  </div>
                  <div className="p-4 bg-[#0A3E45] rounded">
                    <h3 className="text-yellow-400 mb-2">Active Quests</h3>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Quest History</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <p className="text-gray-300">No quest history available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 