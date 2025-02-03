"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';

interface Reward {
  rewardId: string;
  attendeeId: string;
  rewardPoolId: string;
  amount: string;
  rewardType: string;
  poolWalletAddress: string;
}

export default function RewardsAdminPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const handleNewReward = () => {
    setSelectedReward(null);
    setShowCreateForm(true);
  };

  return (
    <div className="min-h-screen bg-[#0A3E45] text-white font-sans">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <a href="/Admin" className="text-yellow-400 hover:text-yellow-300 mr-4">← Back to Dashboard</a>
          <h1 className="text-3xl font-bold text-yellow-400">Rewards Admin Management</h1>
        </div>

        <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg">
          <div className="grid gap-6">
            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Create Reward</h2>
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-[#AB8F3D] text-black px-4 py-2 rounded hover:bg-[#E3B051] transition-colors"
              >
                {showCreateForm ? 'Cancel' : 'Create Reward'}
              </button>

              {showCreateForm && (
                <div className="mt-4 bg-[#162F35] p-6 rounded">
                  <form id="reward-form" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="reward-id" className="block text-yellow-400 mb-2">Reward ID</label>
                        <input
                          type="text"
                          id="reward-id"
                          name="reward-id"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          disabled
                        />
                      </div>

                      <div>
                        <label htmlFor="attendee-id" className="block text-yellow-400 mb-2">Attendee ID</label>
                        <input
                          type="text"
                          id="attendee-id"
                          name="attendee-id"
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

                      <div>
                        <label htmlFor="amount" className="block text-yellow-400 mb-2">Amount</label>
                        <input
                          type="text"
                          id="amount"
                          name="amount"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="reward-type" className="block text-yellow-400 mb-2">Reward Type</label>
                        <input
                          type="text"
                          id="reward-type"
                          name="reward-type"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="pool-wallet-address" className="block text-yellow-400 mb-2">Pool Wallet Address</label>
                        <input
                          type="text"
                          id="pool-wallet-address"
                          name="pool-wallet-address"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        type="button"
                        id="new-reward"
                        onClick={handleNewReward}
                        className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400"
                      >
                        New Reward
                      </button>
                      <button
                        type="submit"
                        id="create-reward"
                        className="bg-[#AB8F3D] text-black px-6 py-2 rounded hover:bg-[#E3B051] transition-colors"
                      >
                        Create Reward
                      </button>
                      <button
                        type="button"
                        id="update-reward"
                        className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400"
                      >
                        Update Reward
                      </button>
                      <button
                        type="button"
                        id="delete-reward"
                        className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
                      >
                        Delete Reward
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Rewards List</h2>
              <div className="bg-[#162F35] p-4 rounded">
                {rewards.length === 0 ? (
                  <p className="text-gray-300">No rewards found</p>
                ) : (
                  <ul className="space-y-4">
                    {rewards.map((reward) => (
                      <li 
                        key={reward.rewardId}
                        className="p-4 bg-[#0A3E45] rounded hover:bg-[#0F262B] cursor-pointer"
                        onClick={() => {
                          setSelectedReward(reward);
                          setShowCreateForm(true);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-yellow-400 font-semibold">Reward {reward.rewardId}</h3>
                            <p className="text-gray-300 text-sm mt-1">Attendee ID: {reward.attendeeId}</p>
                            <p className="text-gray-400 text-sm mt-2">
                              Amount: {reward.amount} | Type: {reward.rewardType}
                            </p>
                          </div>
                          <span className="text-sm text-gray-400">
                            Pool ID: {reward.rewardPoolId}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Reward Statistics</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#0A3E45] rounded">
                    <h3 className="text-yellow-400 mb-2">Total Rewards</h3>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <div className="p-4 bg-[#0A3E45] rounded">
                    <h3 className="text-yellow-400 mb-2">Total Amount</h3>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <div className="p-4 bg-[#0A3E45] rounded">
                    <h3 className="text-yellow-400 mb-2">Active Pools</h3>
                    <p className="text-2xl font-bold">0</p>
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