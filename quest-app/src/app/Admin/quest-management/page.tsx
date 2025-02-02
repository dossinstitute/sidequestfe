"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';

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

  return (
    <div className="min-h-screen bg-[#0A3E45] text-white font-sans pt-[88px]">
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
                        id="new-quest-event"
                        className="bg-[#AB8F3D] text-black px-6 py-2 rounded hover:bg-[#E3B051] transition-colors"
                      >
                        New Quest Event
                      </button>
                      <button
                        type="button"
                        id="create-quest-event"
                        className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400"
                      >
                        Create Quest Event
                      </button>
                      <button
                        type="button"
                        id="update-quest-event"
                        className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400"
                      >
                        Update Quest Event
                      </button>
                      <button
                        type="button"
                        id="delete-quest-event"
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