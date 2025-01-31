"use client";

import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, JsonRpcSigner } from 'ethers';

interface Quest {
  id: number;
  name: string;
  description: string;
  defaultStartDate: string;
  defaultEndDate: string;
  defaultInteractions: number;
  defaultRewardAmount: string;
  status: boolean;
}

export default function QuestSetupPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [questManagerContract, setQuestManagerContract] = useState<Contract | null>(null);

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
            "event QuestCreated(uint256 questId, string name, string description, uint256 defaultStartDate, uint256 defaultEndDate, uint256 defaultInteractions, uint256 defaultRewardAmount, uint8 status)",
            "function createQuest(string name, string description, uint256 defaultStartDate, uint256 defaultEndDate, uint256 defaultInteractions, uint256 defaultRewardAmount) returns (bool)",
            "function updateQuest(uint256 questId, string name, string description, uint256 defaultStartDate, uint256 defaultEndDate, uint256 defaultInteractions, uint256 defaultRewardAmount, uint8 status) returns (bool)",
            "function deleteQuest(uint256 questId) returns (bool)",
            "function getQuestCount() view returns (uint256)",
            "function getQuestByIndex(uint256 index) view returns (tuple(uint256 questId, string name, string description, uint256 defaultStartDate, uint256 defaultEndDate, uint256 defaultInteractions, uint256 defaultRewardAmount, uint8 status))"
          ];
          
          const signer = await web3Provider.getSigner();
          const contract = new Contract(contractAddress, contractABI, signer);
          setQuestManagerContract(contract);

          // Fetch quests after contract is initialized
          fetchQuests();
        } catch (error) {
          console.error("Failed to initialize web3:", error);
        }
      } else {
        console.error("Please install MetaMask!");
      }
    };

    initializeWeb3();
  }, []);

  const fetchQuests = async () => {
    if (!questManagerContract) return;

    try {
      const questCount = await questManagerContract.getQuestCount();
      const fetchedQuests = [];
      
      for (let i = 0; i < questCount; i++) {
        const quest = await questManagerContract.getQuestByIndex(i);
        fetchedQuests.push({
          id: quest.questId.toNumber(),
          name: quest.name,
          description: quest.description,
          defaultStartDate: new Date(quest.defaultStartDate * 1000).toISOString().split('T')[0],
          defaultEndDate: new Date(quest.defaultEndDate * 1000).toISOString().split('T')[0],
          defaultInteractions: quest.defaultInteractions.toNumber(),
          defaultRewardAmount: quest.defaultRewardAmount.toString(),
          status: quest.status === 0, // 0 for active, 1 for inactive
        });
      }
      
      setQuests(fetchedQuests);
    } catch (error) {
      console.error("Failed to fetch quests:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questManagerContract) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const defaultStartDate = new Date(formData.get('default-start-date') as string).getTime() / 1000;
    const defaultEndDate = new Date(formData.get('default-end-date') as string).getTime() / 1000;
    const defaultInteractions = parseInt(formData.get('default-interactions') as string);
    const defaultRewardAmount = formData.get('default-reward-amount') as string;

    try {
      const tx = await questManagerContract.createQuest(
        name,
        description,
        defaultStartDate,
        defaultEndDate,
        defaultInteractions,
        defaultRewardAmount
      );
      await tx.wait();
      console.log("Quest created successfully!");
      
      // Refresh quests list and reset form
      await fetchQuests();
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create quest:", error);
    }
  };

  const handleUpdate = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!questManagerContract) return;

    const form = document.getElementById('quest-form') as HTMLFormElement;
    const formData = new FormData(form);
    
    const questId = parseInt(formData.get('quest-id') as string);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const defaultStartDate = new Date(formData.get('default-start-date') as string).getTime() / 1000;
    const defaultEndDate = new Date(formData.get('default-end-date') as string).getTime() / 1000;
    const defaultInteractions = parseInt(formData.get('default-interactions') as string);
    const defaultRewardAmount = formData.get('default-reward-amount') as string;
    const status = formData.get('status') === '0' ? 0 : 1;

    try {
      const tx = await questManagerContract.updateQuest(
        questId,
        name,
        description,
        defaultStartDate,
        defaultEndDate,
        defaultInteractions,
        defaultRewardAmount,
        status
      );
      await tx.wait();
      console.log("Quest updated successfully!");
      
      await fetchQuests();
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to update quest:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!questManagerContract) return;

    const form = document.getElementById('quest-form') as HTMLFormElement;
    const formData = new FormData(form);
    const questId = parseInt(formData.get('quest-id') as string);

    try {
      const tx = await questManagerContract.deleteQuest(questId);
      await tx.wait();
      console.log("Quest deleted successfully!");
      
      await fetchQuests();
      form.reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to delete quest:", error);
    }
  };

  const handleQuestSelection = (quest: Quest) => {
    const form = document.getElementById('quest-form') as HTMLFormElement;
    if (!form) return;

    // Populate form fields with selected quest data
    (form.querySelector('#quest-id') as HTMLInputElement).value = quest.id.toString();
    (form.querySelector('#name') as HTMLInputElement).value = quest.name;
    (form.querySelector('#description') as HTMLInputElement).value = quest.description;
    (form.querySelector('#default-start-date') as HTMLInputElement).value = quest.defaultStartDate;
    (form.querySelector('#default-end-date') as HTMLInputElement).value = quest.defaultEndDate;
    (form.querySelector('#default-interactions') as HTMLInputElement).value = quest.defaultInteractions.toString();
    (form.querySelector('#default-reward-amount') as HTMLInputElement).value = quest.defaultRewardAmount;
    (form.querySelector('#status') as HTMLSelectElement).value = quest.status ? '0' : '1';

    setShowCreateForm(true);
  };

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
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-[#AB8F3D] text-black px-4 py-2 rounded hover:bg-[#E3B051] transition-colors"
              >
                {showCreateForm ? 'Cancel' : 'Create Quest Template'}
              </button>

              {showCreateForm && (
                <div className="mt-4 bg-[#162F35] p-6 rounded">
                  <form id="quest-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quest-id" className="block text-yellow-400 mb-2">Quest ID</label>
                        <input
                          type="text"
                          id="quest-id"
                          name="quest-id"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Quest ID"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="name" className="block text-yellow-400 mb-2">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Quest Name"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-yellow-400 mb-2">Description</label>
                        <input
                          type="text"
                          id="description"
                          name="description"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Quest Description"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="default-start-date" className="block text-yellow-400 mb-2">Default Start Date</label>
                        <input
                          type="date"
                          id="default-start-date"
                          name="default-start-date"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="default-end-date" className="block text-yellow-400 mb-2">Default End Date</label>
                        <input
                          type="date"
                          id="default-end-date"
                          name="default-end-date"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="default-interactions" className="block text-yellow-400 mb-2">Default Number of Required Interactions</label>
                        <input
                          type="number"
                          id="default-interactions"
                          name="default-interactions"
                          min="3"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="default-reward-amount" className="block text-yellow-400 mb-2">Default Reward Amount</label>
                        <input
                          type="text"
                          id="default-reward-amount"
                          name="default-reward-amount"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="status" className="block text-yellow-400 mb-2">Status</label>
                        <select
                          id="status"
                          name="status"
                          className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="0">Active</option>
                          <option value="1">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        type="button"
                        id="new-quest"
                        className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400"
                      >
                        New Quest
                      </button>
                      <button
                        type="submit"
                        id="create-quest"
                        className="bg-[#AB8F3D] text-black px-6 py-2 rounded hover:bg-[#E3B051] transition-colors"
                      >
                        Create Quest
                      </button>
                      <button
                        type="button"
                        id="update-quest"
                        className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400"
                      >
                        Update Quest
                      </button>
                      <button
                        type="button"
                        id="delete-quest"
                        className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
                      >
                        Delete Quest
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Quest Templates</h2>
              <div className="bg-[#162F35] p-4 rounded">
                {quests.length > 0 ? (
                  <ul className="space-y-4">
                    {quests.map((quest) => (
                      <li 
                        key={quest.id} 
                        className="p-4 bg-[#0A3E45] rounded hover:bg-[#0F262B] cursor-pointer"
                        onClick={() => handleQuestSelection(quest)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-yellow-400 font-semibold">{quest.name}</h3>
                            <p className="text-gray-300 text-sm mt-1">{quest.description}</p>
                            <p className="text-gray-400 text-sm mt-2">
                              Required Interactions: {quest.defaultInteractions} | Reward: {quest.defaultRewardAmount}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${quest.status ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                            {quest.status ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300">No quest templates found</p>
                )}
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