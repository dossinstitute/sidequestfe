"use client";

import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Event {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  status: boolean;
}

export default function EventAdminPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [eventManagerContract, setEventManagerContract] = useState<Contract | null>(null);

  // Initialize Web3 and Contract
  useEffect(() => {
    const initializeWeb3 = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Provider = new BrowserProvider(window.ethereum);
          setProvider(web3Provider);
          
          // Initialize contract (you'll need to add your contract address and ABI)
          const contractAddress = "YOUR_CONTRACT_ADDRESS";
          const contractABI = [
            // Add your contract ABI here
            "event EventsCreated(uint256 eventId, string name, string description, uint256 startDate, uint256 endDate, uint8 status)",
            "function createEvent(string name, string description, uint256 startDate, uint256 endDate) returns (bool)",
            "function updateEvent(uint256 eventId, string name, string description, uint256 startDate, uint256 endDate, uint8 status) returns (bool)",
            "function deleteEvent(uint256 eventId) returns (bool)",
            "function getEventCount() view returns (uint256)",
            "function getEventByIndex(uint256 index) view returns (tuple(uint256 eventId, string name, string description, uint256 startDate, uint256 endDate, uint8 status))"
          ];
          
          const signer = await web3Provider.getSigner();
          const contract = new Contract(contractAddress, contractABI, signer);
          setEventManagerContract(contract);

          // Fetch events after contract is initialized
          fetchEvents();
        } catch (error) {
          console.error("Failed to initialize web3:", error);
        }
      } else {
        console.error("Please install MetaMask!");
      }
    };

    initializeWeb3();
  }, []);

  const fetchEvents = async () => {
    if (!eventManagerContract) return;

    try {
      const eventCount = await eventManagerContract.getEventCount();
      const fetchedEvents = [];
      
      for (let i = 0; i < eventCount; i++) {
        const event = await eventManagerContract.getEventByIndex(i);
        fetchedEvents.push({
          id: event.eventId.toNumber(),
          name: event.name,
          startDate: new Date(event.startDate * 1000).toISOString().split('T')[0],
          endDate: new Date(event.endDate * 1000).toISOString().split('T')[0],
          description: event.description,
          status: event.status,
        });
      }
      
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventManagerContract) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('event-name') as string;
    const description = formData.get('description') as string;
    const startDate = new Date(formData.get('start-date') as string).getTime() / 1000;
    const endDate = new Date(formData.get('end-date') as string).getTime() / 1000;

    try {
      const tx = await eventManagerContract.createEvent(name, description, startDate, endDate);
      await tx.wait();
      console.log("Event created successfully!");
      
      // Refresh events list and reset form
      await fetchEvents();
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const handleUpdate = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!eventManagerContract) return;

    const form = document.getElementById('event-form') as HTMLFormElement;
    const formData = new FormData(form);
    
    const eventId = parseInt(formData.get('event-id') as string);
    const name = formData.get('event-name') as string;
    const description = formData.get('description') as string;
    const startDate = new Date(formData.get('start-date') as string).getTime() / 1000;
    const endDate = new Date(formData.get('end-date') as string).getTime() / 1000;
    const status = formData.get('status') === 'Active';

    try {
      const tx = await eventManagerContract.updateEvent(eventId, name, description, startDate, endDate, status);
      await tx.wait();
      console.log("Event updated successfully!");
      
      await fetchEvents();
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!eventManagerContract) return;

    const form = document.getElementById('event-form') as HTMLFormElement;
    const formData = new FormData(form);
    const eventId = parseInt(formData.get('event-id') as string);

    try {
      const tx = await eventManagerContract.deleteEvent(eventId);
      await tx.wait();
      console.log("Event deleted successfully!");
      
      await fetchEvents();
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
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

                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-yellow-400 mb-2">Description</label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Event Description"
                          required
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
                        onClick={handleUpdate}
                        className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400"
                      >
                        Update Event
                      </button>
                      <button
                        type="button"
                        id="delete-event"
                        onClick={handleDelete}
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
                {events.length > 0 ? (
                  <ul className="space-y-4">
                    {events.filter(event => event.status).map((event) => (
                      <li key={event.id} className="p-4 bg-[#0A3E45] rounded hover:bg-[#0F262B] cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-yellow-400 font-semibold">{event.name}</h3>
                            <p className="text-gray-300 text-sm mt-1">{event.description}</p>
                            <p className="text-gray-400 text-sm mt-2">
                              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
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
                  <p className="text-gray-300">No active events found</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Event History</h2>
              <div className="bg-[#162F35] p-4 rounded">
                {events.length > 0 ? (
                  <ul className="space-y-4">
                    {events.filter(event => !event.status).map((event) => (
                      <li key={event.id} className="p-4 bg-[#0A3E45] rounded hover:bg-[#0F262B] cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-yellow-400 font-semibold">{event.name}</h3>
                            <p className="text-gray-300 text-sm mt-1">{event.description}</p>
                            <p className="text-gray-400 text-sm mt-2">
                              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs">
                            Completed
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300">No past events found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 