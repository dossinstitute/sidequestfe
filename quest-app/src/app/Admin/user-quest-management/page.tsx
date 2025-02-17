"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BrowserProvider, Contract } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface UserQuestEvent {
  userQuestEventId: string;
  userId: string;
  questEventId: string;
  interactions: number;
  validated: boolean;
  url: string;
  completed: boolean;
}

export default function UserQuestManagementPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userQuestEvents, setUserQuestEvents] = useState<UserQuestEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<UserQuestEvent | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [userQuestManagerContract, setUserQuestManagerContract] = useState<Contract | null>(null);

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
            "function createUserQuestEvent(string userId, string questEventId, uint256 interactions, string url, bool validated, bool completed) returns (bool)",
            "function updateUserQuestEvent(string userQuestEventId, string userId, string questEventId, uint256 interactions, string url, bool validated, bool completed) returns (bool)",
            "function deleteUserQuestEvent(string userQuestEventId) returns (bool)",
            "function getUserQuestEventCount() view returns (uint256)",
            "function getUserQuestEventByIndex(uint256 index) view returns (tuple(string userQuestEventId, string userId, string questEventId, uint256 interactions, string url, bool validated, bool completed))"
          ];

          const signer = await web3Provider.getSigner();
          const contract = new Contract(contractAddress, contractABI, signer);
          setUserQuestManagerContract(contract);

          // Fetch user quest events after contract is initialized
          fetchUserQuestEvents();
        } catch (error) {
          console.error("Failed to initialize web3:", error);
        }
      } else {
        console.error("Please install MetaMask!");
      }
    };

    initializeWeb3();
  }, []);

  const fetchUserQuestEvents = async () => {
    if (!userQuestManagerContract) return;

    try {
      const userQuestEventCount = await userQuestManagerContract.getUserQuestEventCount();
      const fetchedUserQuestEvents = [];

      for (let i = 0; i < userQuestEventCount; i++) {
        const userQuestEvent = await userQuestManagerContract.getUserQuestEventByIndex(i);
        fetchedUserQuestEvents.push({
          userQuestEventId: userQuestEvent.userQuestEventId,
          userId: userQuestEvent.userId,
          questEventId: userQuestEvent.questEventId,
          interactions: userQuestEvent.interactions,
          url: userQuestEvent.url,
          validated: userQuestEvent.validated,
          completed: userQuestEvent.completed,
        });
      }

      setUserQuestEvents(fetchedUserQuestEvents);
    } catch (error) {
      console.error("Failed to fetch user quest events:", error);
    }
  };

  const handleCreateUserQuestEvent = async () => {
    if (!userQuestManagerContract) return;

    try {
      const form = document.getElementById('user-quest-event-form') as HTMLFormElement;
      const formData = new FormData(form);

      const userId = formData.get('user-id') as string;
      const questEventId = formData.get('quest-event-id') as string;
      const interactions = parseInt(formData.get('interactions') as string);
      const url = formData.get('url') as string;
      const validated = formData.get('validated') === 'on';
      const completed = formData.get('completed') === 'on';

      const tx = await userQuestManagerContract.createUserQuestEvent(userId, questEventId, interactions, url, validated, completed);
      await tx.wait();
      console.log("User quest event created successfully!");

      await fetchUserQuestEvents();
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create user quest event:", error);
    }
  };

  const handleUpdateUserQuestEvent = async () => {
    if (!userQuestManagerContract || !selectedEvent) return;

    try {
      const form = document.getElementById('user-quest-event-form') as HTMLFormElement;
      const formData = new FormData(form);

      const userQuestEventId = selectedEvent.userQuestEventId;
      const userId = formData.get('user-id') as string;
      const questEventId = formData.get('quest-event-id') as string;
      const interactions = parseInt(formData.get('interactions') as string);
      const url = formData.get('url') as string;
      const validated = formData.get('validated') === 'on';
      const completed = formData.get('completed') === 'on';

      const tx = await userQuestManagerContract.updateUserQuestEvent(userQuestEventId, userId, questEventId, interactions, url, validated, completed);
      await tx.wait();
      console.log("User quest event updated successfully!");

      await fetchUserQuestEvents();
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to update user quest event:", error);
    }
  };

  const handleDeleteUserQuestEvent = async () => {
    if (!userQuestManagerContract || !selectedEvent) return;

    try {
      const tx = await userQuestManagerContract.deleteUserQuestEvent(selectedEvent.userQuestEventId);
      await tx.wait();
      console.log("User quest event deleted successfully!");

      await fetchUserQuestEvents();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to delete user quest event:", error);
    }
  };

  const handleNewEvent = () => {
    setSelectedEvent(null);
    setShowCreateForm(true);
  };

  return (
    <div className="min-h-screen bg-[#0A3E45] text-white font-sans">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <a href="/Admin" className="text-yellow-400 hover:text-yellow-300 mr-4">← Back to Dashboard</a>
          <h1 className="text-3xl font-bold text-yellow-400">User Quest Event Management</h1>
        </div>

        <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg">
          <div className="grid gap-6">
            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Create User Quest Event</h2>
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-[#AB8F3D] text-black px-4 py-2 rounded hover:bg-[#E3B051] transition-colors"
              >
                {showCreateForm ? 'Cancel' : 'Create User Quest Event'}
              </button>

              {showCreateForm && (
                <div className="mt-4 bg-[#162F35] p-6 rounded">
                  <form id="user-quest-event-form" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="user-quest-event-id" className="block text-yellow-400 mb-2">User Quest Event ID</label>
                        <input
                          type="text"
                          id="user-quest-event-id"
                          name="user-quest-event-id"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          readOnly
                        />
                      </div>

                      <div>
                        <label htmlFor="user-id" className="block text-yellow-400 mb-2">User ID</label>
                        <input
                          type="text"
                          id="user-id"
                          name="user-id"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="quest-event-id" className="block text-yellow-400 mb-2">Event - Quest</label>
                        <select
                          id="quest-event-id"
                          name="quest-event-id"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        >
                          <option value="">Select Event-Quest</option>
                          {/* Add options dynamically */}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="interactions" className="block text-yellow-400 mb-2">Interactions</label>
                        <input
                          type="number"
                          id="interactions"
                          name="interactions"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="url" className="block text-yellow-400 mb-2">URL</label>
                        <input
                          type="text"
                          id="url"
                          name="url"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>

                      <div className="flex space-x-8">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="validated"
                            name="validated"
                            className="w-4 h-4 bg-[#0A3E45] border-yellow-400 rounded focus:ring-2 focus:ring-yellow-400"
                          />
                          <label htmlFor="validated" className="block text-yellow-400 ml-2">Validated</label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="completed"
                            name="completed"
                            className="w-4 h-4 bg-[#0A3E45] border-yellow-400 rounded focus:ring-2 focus:ring-yellow-400"
                          />
                          <label htmlFor="completed" className="block text-yellow-400 ml-2">Completed</label>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        type="button"
                        id="new-user-quest-event"
                        onClick={handleNewEvent}
                        className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400"
                      >
                        New User Quest Event
                      </button>
                      <button
                        type="button"
                        id="create-user-quest-event"
                        onClick={handleCreateUserQuestEvent}
                        className="bg-[#AB8F3D] text-black px-6 py-2 rounded hover:bg-[#E3B051] transition-colors"
                      >
                        Create User Quest Event
                      </button>
                      <button
                        type="button"
                        id="update-user-quest-event"
                        onClick={handleUpdateUserQuestEvent}
                        className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400"
                      >
                        Update User Quest Event
                      </button>
                      <button
                        type="button"
                        id="delete-user-quest-event"
                        onClick={handleDeleteUserQuestEvent}
                        className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
                      >
                        Delete User Quest Event
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">User Quest Events</h2>
              <div className="bg-[#162F35] p-4 rounded">
                {userQuestEvents.length === 0 ? (
                  <p className="text-gray-300">No user quest events found</p>
                ) : (
                  <ul className="space-y-4">
                    {userQuestEvents.map((event) => (
                      <li 
                        key={event.userQuestEventId}
                        className="p-4 bg-[#0A3E45] rounded hover:bg-[#0F262B] cursor-pointer"
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowCreateForm(true);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-yellow-400 font-semibold">User Quest Event {event.userQuestEventId}</h3>
                            <p className="text-gray-300 text-sm mt-1">User ID: {event.userId}</p>
                            <p className="text-gray-400 text-sm mt-2">
                              Interactions: {event.interactions} | {event.completed ? 'Completed' : 'In Progress'}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            event.validated ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                          }`}>
                            {event.validated ? 'Validated' : 'Not Validated'}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Quest Participation</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#0A3E45] rounded">
                    <h3 className="text-yellow-400 mb-2">Active Users</h3>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <div className="p-4 bg-[#0A3E45] rounded">
                    <h3 className="text-yellow-400 mb-2">Completed Quests</h3>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <div className="p-4 bg-[#0A3E45] rounded">
                    <h3 className="text-yellow-400 mb-2">Success Rate</h3>
                    <p className="text-2xl font-bold">0%</p>
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