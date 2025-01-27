"use client";

import Header from '@/components/Header';

export default function QuestSetupPage() {
  return (
    <div className="min-h-screen bg-[#0A3E45] text-white font-sans">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <a href="/Admin" className="text-yellow-400 hover:text-yellow-300 mr-4">← Back to Dashboard</a>
          <h1 className="text-3xl font-bold text-yellow-400">Quest Definition and Setup</h1>
        </div>

        <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg">
          <div className="grid gap-6">
            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Create New Quest</h2>
              <button className="bg-[#AB8F3D] text-black px-4 py-2 rounded hover:bg-[#E3B051] transition-colors">
                Create Quest Template
              </button>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Quest Templates</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <p className="text-gray-300">No quest templates found</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Quest Requirements</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Configure Default Requirements</span>
                  <button className="bg-[#AB8F3D] text-black px-4 py-2 rounded hover:bg-[#E3B051] transition-colors">
                    Edit Requirements
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 