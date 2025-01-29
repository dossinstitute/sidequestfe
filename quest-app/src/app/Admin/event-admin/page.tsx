"use client";

import Header from '@/components/Header';
import { useState } from 'react';

export default function EventAdminPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-[#0A3E45] text-white font-sans">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <a href="/Admin" className="text-yellow-400 hover:text-yellow-300 mr-4">← Back to Dashboard</a>
          <h1 className="text-3xl font-bold text-yellow-400">Event Admin Functions</h1>
        </div>

        <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg">
          <div className="grid gap-6">
            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Create New Event</h2>
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-[#AB8F3D] text-black px-4 py-2 rounded hover:bg-[#E3B051] transition-colors"
              >
                {showCreateForm ? 'Cancel' : 'Create Event'}
              </button>

              {showCreateForm && (
                <div className="mt-4 bg-[#162F35] p-6 rounded">
                  <form id="event-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="event-id" className="block text-yellow-400 mb-2">Event ID</label>
                        <input
                          type="number"
                          id="event-id"
                          name="event-id"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Event ID"
                        />
                      </div>

                      <div>
                        <label htmlFor="event-name" className="block text-yellow-400 mb-2">Event Name</label>
                        <input
                          type="text"
                          id="event-name"
                          name="event-name"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Event Name"
                        />
                      </div>

                      <div>
                        <label htmlFor="start-date" className="block text-yellow-400 mb-2">Start Date</label>
                        <input
                          type="date"
                          id="start-date"
                          name="start-date"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>

                      <div>
                        <label htmlFor="end-date" className="block text-yellow-400 mb-2">End Date</label>
                        <input
                          type="date"
                          id="end-date"
                          name="end-date"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-yellow-400 mb-2">Description</label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Event Description"
                        ></textarea>
                      </div>

                      <div>
                        <label htmlFor="status" className="block text-yellow-400 mb-2">Status</label>
                        <select
                          id="status"
                          name="status"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        type="submit"
                        id="create-event"
                        className="bg-[#AB8F3D] text-black px-6 py-2 rounded hover:bg-[#E3B051] transition-colors"
                      >
                        Create Event
                      </button>
                      <button
                        type="button"
                        id="update-event"
                        className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400"
                      >
                        Update Event
                      </button>
                      <button
                        type="button"
                        id="delete-event"
                        className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
                      >
                        Delete Event
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Active Events</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <p className="text-gray-300">No active events found</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Event History</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <p className="text-gray-300">No past events found</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 