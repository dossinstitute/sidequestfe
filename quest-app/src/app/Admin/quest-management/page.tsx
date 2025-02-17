"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BrowserProvider, Contract } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface QuestEvent {
  id: string;
  eventId: string;
  questId: string;
  minimumInteractions: number;
  startDate: string;
  endDate: string;
  rewardAmount: number;
  urlHashTags: string;
}

export default function QuestManagementPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [questEvents, setQuestEvents] = useState<QuestEvent[]>([]);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [questManagerContract, setQuestManagerContract] = useState<Contract | null>(null);

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
            "function createQuestEvent(string eventId, string questId, uint256 minimumInteractions, uint256 startDate, uint256 endDate, uint256 rewardAmount, string urlHashTags) returns (bool)",
            "function updateQuestEvent(string id, string eventId, string questId, uint256 minimumInteractions, uint256 startDate, uint256 endDate, uint256 rewardAmount, string urlHashTags) returns (bool)",
            "function deleteQuestEvent(string id) returns (bool)",
            "function getQuestEventCount() view returns (uint256)",
            "function getQuestEventByIndex(uint256 index) view returns (tuple(string id, string eventId, string questId, uint256 minimumInteractions, uint256 startDate, uint256 endDate, uint256 rewardAmount, string urlHashTags))"
          ];

          const signer = await web3Provider.getSigner();
          const contract = new Contract(contractAddress, contractABI, signer);
          setQuestManagerContract(contract);

          // Fetch quest events after contract is initialized
          fetchQuestEvents();
        } catch (error) {
          console.error("Failed to initialize web3:", error);
        }
      } else {
        console.error("Please install MetaMask!");
      }
    };

    initializeWeb3();
  }, []);

  const fetchQuestEvents = async () => {
    if (!questManagerContract) return;

    try {
      const questEventCount = await questManagerContract.getQuestEventCount();
      const fetchedQuestEvents = [];

      for (let i = 0; i < questEventCount; i++) {
        const questEvent = await questManagerContract.getQuestEventByIndex(i);
        fetchedQuestEvents.push({
          id: questEvent.id,
          eventId: questEvent.eventId,
          questId: questEvent.questId,
          minimumInteractions: questEvent.minimumInteractions,
          startDate: new Date(questEvent.startDate * 1000).toISOString().split('T')[0],
          endDate: new Date(questEvent.endDate * 1000).toISOString().split('T')[0],
          rewardAmount: questEvent.rewardAmount,
          urlHashTags: questEvent.urlHashTags,
        });
      }

      setQuestEvents(fetchedQuestEvents);
    } catch (error) {
      console.error("Failed to fetch quest events:", error);
    }
  };

  const handleCreateQuestEvent = async () => {
    if (!questManagerContract) return;

    try {
      const form = document.getElementById('quest-event-form') as HTMLFormElement;
      const formData = new FormData(form);

      const eventId = formData.get('event-id') as string;
      const questId = formData.get('quest-id') as string;
      const minimumInteractions = parseInt(formData.get('minimum-interactions') as string);
      const startDate = new Date(formData.get('start-date') as string).getTime() / 1000;
      const endDate = new Date(formData.get('end-date') as string).getTime() / 1000;
      const rewardAmount = parseInt(formData.get('reward-amount') as string);
      const urlHashTags = formData.get('url-hash-tags') as string;

      const tx = await questManagerContract.createQuestEvent(eventId, questId, minimumInteractions, startDate, endDate, rewardAmount, urlHashTags);
      await tx.wait();
      console.log("Quest event created successfully!");

      await fetchQuestEvents();
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create quest event:", error);
    }
  };

  const handleUpdateQuestEvent = async () => {
    if (!questManagerContract) return;

    try {
      const form = document.getElementById('quest-event-form') as HTMLFormElement;
      const formData = new FormData(form);

      const id = formData.get('quest-event-id') as string;
      const eventId = formData.get('event-id') as string;
      const questId = formData.get('quest-id') as string;
      const minimumInteractions = parseInt(formData.get('minimum-interactions') as string);
      const startDate = new Date(formData.get('start-date') as string).getTime() / 1000;
      const endDate = new Date(formData.get('end-date') as string).getTime() / 1000;
      const rewardAmount = parseInt(formData.get('reward-amount') as string);
      const urlHashTags = formData.get('url-hash-tags') as string;

      const tx = await questManagerContract.updateQuestEvent(id, eventId, questId, minimumInteractions, startDate, endDate, rewardAmount, urlHashTags);
      await tx.wait();
      console.log("Quest event updated successfully!");

      await fetchQuestEvents();
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to update quest event:", error);
    }
  };

  const handleDeleteQuestEvent = async () => {
    if (!questManagerContract) return;

    try {
      const form = document.getElementById('quest-event-form') as HTMLFormElement;
      const formData = new FormData(form);
      const id = formData.get('quest-event-id') as string;

      const tx = await questManagerContract.deleteQuestEvent(id);
      await tx.wait();
      console.log("Quest event deleted successfully!");

      await fetchQuestEvents();
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to delete quest event:", error);
    }
  };

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
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Create New Quest Event</h2>
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-[#AB8F3D] text-black px-4 py-2 rounded hover:bg-[#E3B051] transition-colors"
              >
                {showCreateForm ? 'Cancel' : 'Create Quest Event'}
              </button>

              {showCreateForm && (
                <div className="mt-4 bg-[#162F35] p-6 rounded">
                  <form id="quest-event-form" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quest-event-id" className="block text-yellow-400 mb-2">Quest Event ID</label>
                        <input
                          type="text"
                          id="quest-event-id"
                          name="quest-event-id"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          readOnly
                        />
                      </div>

                      <div>
                        <label htmlFor="event-id" className="block text-yellow-400 mb-2">Event</label>
                        <select
                          id="event-id"
                          name="event-id"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        >
                          <option value="">Select Event</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="quest-id" className="block text-yellow-400 mb-2">Quest</label>
                        <select
                          id="quest-id"
                          name="quest-id"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        >
                          <option value="">Select Quest</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="minimum-interactions" className="block text-yellow-400 mb-2">Minimum Interactions</label>
                        <input
                          type="number"
                          id="minimum-interactions"
                          name="minimum-interactions"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="start-date" className="block text-yellow-400 mb-2">Start Date</label>
                        <input
                          type="date"
                          id="start-date"
                          name="start-date"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="end-date" className="block text-yellow-400 mb-2">End Date</label>
                        <input
                          type="date"
                          id="end-date"
                          name="end-date"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="reward-amount" className="block text-yellow-400 mb-2">Reward Amount</label>
                        <input
                          type="number"
                          id="reward-amount"
                          name="reward-amount"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="url-hash-tags" className="block text-yellow-400 mb-2">URL Hash Tags</label>
                        <input
                          type="text"
                          id="url-hash-tags"
                          name="url-hash-tags"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        type="button"
                        id="create-quest-event"
                        onClick={handleCreateQuestEvent}
                        className="bg-[#AB8F3D] text-black px-6 py-2 rounded hover:bg-[#E3B051] transition-colors"
                      >
                        Create Quest Event
                      </button>
                      <button
                        type="button"
                        id="update-quest-event"
                        onClick={handleUpdateQuestEvent}
                        className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400"
                      >
                        Update Quest Event
                      </button>
                      <button
                        type="button"
                        id="delete-quest-event"
                        onClick={handleDeleteQuestEvent}
                        className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
                      >
                        Delete Quest Event
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Active Quest Events</h2>
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
                {questEvents.length > 0 ? (
                  <ul className="space-y-4">
                    {questEvents.map((questEvent) => (
                      <li key={questEvent.id} className="p-4 bg-[#0A3E45] rounded hover:bg-[#0F262B] cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-yellow-400 font-semibold">{questEvent.questId}</h3>
                            <p className="text-gray-300 text-sm mt-1">Event ID: {questEvent.eventId}</p>
                            <p className="text-gray-400 text-sm mt-2">
                              {new Date(questEvent.startDate).toLocaleDateString()} - {new Date(questEvent.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                            Active
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300">No active quests found</p>
                )}
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