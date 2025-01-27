"use client";

import Header from '@/components/Header';

export default function SponsorAdminPage() {
  return (
    <div className="min-h-screen bg-[#0A3E45] text-white font-sans">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <a href="/Admin" className="text-yellow-400 hover:text-yellow-300 mr-4">← Back to Dashboard</a>
          <h1 className="text-3xl font-bold text-yellow-400">Sponsor Admin Management</h1>
        </div>

        <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg">
          <div className="grid gap-6">
            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Sponsor Management</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <div className="flex justify-between items-center mb-4">
                  <input 
                    type="text" 
                    placeholder="Search sponsors..." 
                    className="bg-[#0A3E45] text-white px-4 py-2 rounded w-64"
                  />
                  <button className="bg-[#AB8F3D] text-black px-4 py-2 rounded hover:bg-[#E3B051] transition-colors">
                    Add Sponsor
                  </button>
                </div>
                <p className="text-gray-300">No sponsors found</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Sponsor Contracts</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Active Contracts</span>
                  <button className="bg-[#AB8F3D] text-black px-4 py-2 rounded hover:bg-[#E3B051] transition-colors">
                    New Contract
                  </button>
                </div>
                <p className="text-gray-300">No active contracts</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Sponsor Analytics</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#0A3E45] rounded">
                    <h3 className="text-yellow-400 mb-2">Total Sponsors</h3>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <div className="p-4 bg-[#0A3E45] rounded">
                    <h3 className="text-yellow-400 mb-2">Active Contracts</h3>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <div className="p-4 bg-[#0A3E45] rounded">
                    <h3 className="text-yellow-400 mb-2">Total Value</h3>
                    <p className="text-2xl font-bold">$0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 