"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';

interface Sponsor {
  id: string;
  companyName: string;
  walletAddress: string;
  rewardPoolId: string;
}

export default function SponsorAdminPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-[#0A3E45] text-white font-sans">
      <Header />
      <main className="pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <a href="/Admin" className="text-yellow-400 hover:text-yellow-300 mr-4">← Back to Dashboard</a>
            <h1 className="text-3xl font-bold text-yellow-400">Sponsor Admin Management</h1>
          </div>

          <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg">
            <div className="grid gap-6">
              <div>
                <h2 className="text-xl font-semibold text-yellow-400 mb-4">Sponsor Management</h2>
                <button 
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-[#AB8F3D] text-black px-4 py-2 rounded hover:bg-[#E3B051] transition-colors"
                >
                  {showCreateForm ? 'Cancel' : 'Add Sponsor'}
                </button>

                {showCreateForm && (
                  <div className="mt-4 bg-[#162F35] p-6 rounded">
                    <form id="sponsor-form" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="sponsor-id" className="block text-yellow-400 mb-2">Sponsor ID</label>
                          <input
                            type="text"
                            id="sponsor-id"
                            name="sponsor-id"
                            className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            readOnly
                          />
                        </div>

                        <div>
                          <label htmlFor="company-name" className="block text-yellow-400 mb-2">Company Name</label>
                          <input
                            type="text"
                            id="company-name"
                            name="company-name"
                            className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="wallet-address" className="block text-yellow-400 mb-2">Wallet Address</label>
                          <input
                            type="text"
                            id="wallet-address"
                            name="wallet-address"
                            className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="reward-pool-id" className="block text-yellow-400 mb-2">Reward Pool ID</label>
                          <input
                            type="text"
                            id="reward-pool-id"
                            name="reward-pool-id"
                            className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 mt-6">
                        <button
                          type="button"
                          id="new-sponsor"
                          className="bg-[#AB8F3D] text-black px-6 py-2 rounded hover:bg-[#E3B051] transition-colors"
                        >
                          New Sponsor
                        </button>
                        <button
                          type="button"
                          id="create-sponsor"
                          className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400"
                        >
                          Create Sponsor
                        </button>
                        <button
                          type="button"
                          id="update-sponsor"
                          className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400"
                        >
                          Update Sponsor
                        </button>
                        <button
                          type="button"
                          id="delete-sponsor"
                          className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
                        >
                          Delete Sponsor
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="mt-4 bg-[#162F35] p-4 rounded">
                  <div className="flex justify-between items-center mb-4">
                    <input 
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search sponsors..." 
                      className="bg-[#0A3E45] text-white px-4 py-2 rounded w-64"
                    />
                  </div>
                  {sponsors.length === 0 ? (
                    <p className="text-gray-300">No sponsors found</p>
                  ) : (
                    <div className="space-y-2">
                      {/* Sponsor list items would go here */}
                    </div>
                  )}
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
      </main>
    </div>
  );
} 