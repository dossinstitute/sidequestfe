"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BrowserProvider, Contract } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

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
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [rewardsManagerContract, setRewardsManagerContract] = useState<Contract | null>(null);

  // Initialize Web3 and Contract
  useEffect(() => {
    const initializeWeb3 = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Provider = new BrowserProvider(window.ethereum);
          setProvider(web3Provider);

          // Initialize contract (add your contract address and ABI)
          const contractAddress = "YOUR_CONTRACT_ADDRESS";
          const contractABI = [
            // Add your contract ABI here
            "function createReward(string attendeeId, string rewardPoolId, string amount, string rewardType, string poolWalletAddress) returns (bool)",
            "function updateReward(string rewardId, string attendeeId, string rewardPoolId, string amount, string rewardType, string poolWalletAddress) returns (bool)",
            "function deleteReward(string rewardId) returns (bool)",
            "function getRewardCount() view returns (uint256)",
            "function getRewardByIndex(uint256 index) view returns (tuple(string rewardId, string attendeeId, string rewardPoolId, string amount, string rewardType, string poolWalletAddress))"
          ];

          const signer = await web3Provider.getSigner();
          const contract = new Contract(contractAddress, contractABI, signer);
          setRewardsManagerContract(contract);

          // Fetch rewards after contract is initialized
          fetchRewards();
        } catch (error) {
          console.error("Failed to initialize web3:", error);
        }
      } else {
        console.error("Please install MetaMask!");
      }
    };

    initializeWeb3();
  }, []);

  const fetchRewards = async () => {
    if (!rewardsManagerContract) return;

    try {
      const rewardCount = await rewardsManagerContract.getRewardCount();
      const fetchedRewards = [];

      for (let i = 0; i < rewardCount; i++) {
        const reward = await rewardsManagerContract.getRewardByIndex(i);
        fetchedRewards.push({
          rewardId: reward.rewardId,
          attendeeId: reward.attendeeId,
          rewardPoolId: reward.rewardPoolId,
          amount: reward.amount,
          rewardType: reward.rewardType,
          poolWalletAddress: reward.poolWalletAddress,
        });
      }

      setRewards(fetchedRewards);
    } catch (error) {
      console.error("Failed to fetch rewards:", error);
    }
  };

  const handleCreateReward = async () => {
    if (!rewardsManagerContract) return;

    try {
      const form = document.getElementById('reward-form') as HTMLFormElement;
      const formData = new FormData(form);

      const attendeeId = formData.get('attendee-id') as string;
      const rewardPoolId = formData.get('reward-pool-id') as string;
      const amount = formData.get('amount') as string;
      const rewardType = formData.get('reward-type') as string;
      const poolWalletAddress = formData.get('pool-wallet-address') as string;

      const tx = await rewardsManagerContract.createReward(attendeeId, rewardPoolId, amount, rewardType, poolWalletAddress);
      await tx.wait();
      console.log("Reward created successfully!");

      await fetchRewards();
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create reward:", error);
    }
  };

  const handleUpdateReward = async () => {
    if (!rewardsManagerContract || !selectedReward) return;

    try {
      const form = document.getElementById('reward-form') as HTMLFormElement;
      const formData = new FormData(form);

      const rewardId = selectedReward.rewardId;
      const attendeeId = formData.get('attendee-id') as string;
      const rewardPoolId = formData.get('reward-pool-id') as string;
      const amount = formData.get('amount') as string;
      const rewardType = formData.get('reward-type') as string;
      const poolWalletAddress = formData.get('pool-wallet-address') as string;

      const tx = await rewardsManagerContract.updateReward(rewardId, attendeeId, rewardPoolId, amount, rewardType, poolWalletAddress);
      await tx.wait();
      console.log("Reward updated successfully!");

      await fetchRewards();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to update reward:", error);
    }
  };

  const handleDeleteReward = async () => {
    if (!rewardsManagerContract || !selectedReward) return;

    try {
      const tx = await rewardsManagerContract.deleteReward(selectedReward.rewardId);
      await tx.wait();
      console.log("Reward deleted successfully!");

      await fetchRewards();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to delete reward:", error);
    }
  };

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
                        type="button"
                        id="create-reward"
                        onClick={handleCreateReward}
                        className="bg-[#AB8F3D] text-black px-6 py-2 rounded hover:bg-[#E3B051] transition-colors"
                      >
                        Create Reward
                      </button>
                      <button
                        type="button"
                        id="update-reward"
                        onClick={handleUpdateReward}
                        className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400"
                      >
                        Update Reward
                      </button>
                      <button
                        type="button"
                        id="delete-reward"
                        onClick={handleDeleteReward}
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