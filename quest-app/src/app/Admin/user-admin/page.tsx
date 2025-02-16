"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BrowserProvider, Contract } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface User {
  userId: string;
  walletAddress: string;
  role: string;
}

export default function UserAdminPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [userManagerContract, setUserManagerContract] = useState<Contract | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<User>({
    userId: '',
    walletAddress: '',
    role: ''
  });

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
            "function createUser(string walletAddress, string role) returns (bool)",
            "function updateUser(string userId, string walletAddress, string role) returns (bool)",
            "function deleteUser(string userId) returns (bool)",
            "function getUserCount() view returns (uint256)",
            "function getUserByIndex(uint256 index) view returns (tuple(string userId, string walletAddress, string role))"
          ];

          const signer = await web3Provider.getSigner();
          const contract = new Contract(contractAddress, contractABI, signer);
          setUserManagerContract(contract);

          // Fetch users after contract is initialized
          fetchUsers();
        } catch (error) {
          console.error("Failed to initialize web3:", error);
        }
      } else {
        console.error("Please install MetaMask!");
      }
    };

    initializeWeb3();
  }, []);

  const fetchUsers = async () => {
    if (!userManagerContract) return;

    try {
      const userCount = await userManagerContract.getUserCount();
      const fetchedUsers = [];

      for (let i = 0; i < userCount; i++) {
        const user = await userManagerContract.getUserByIndex(i);
        fetchedUsers.push({
          userId: user.userId,
          walletAddress: user.walletAddress,
          role: user.role,
        });
      }

      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleNewUser = () => {
    setSelectedUser(null);
    setFormData({
      userId: '',
      walletAddress: '',
      role: ''
    });
  };

  const handleCreateUser = async () => {
    if (!userManagerContract) return;

    try {
      const tx = await userManagerContract.createUser(formData.walletAddress, formData.role);
      await tx.wait();
      console.log("User created successfully!");

      await fetchUsers();
      handleNewUser();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (!userManagerContract || !selectedUser) return;

    try {
      const tx = await userManagerContract.updateUser(selectedUser.userId, formData.walletAddress, formData.role);
      await tx.wait();
      console.log("User updated successfully!");

      await fetchUsers();
      handleNewUser();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!userManagerContract || !selectedUser) return;

    try {
      const tx = await userManagerContract.deleteUser(selectedUser.userId);
      await tx.wait();
      console.log("User deleted successfully!");

      await fetchUsers();
      handleNewUser();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A3E45] text-white font-sans">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <a href="/Admin" className="text-yellow-400 hover:text-yellow-300 mr-4">← Back to Dashboard</a>
          <h1 className="text-3xl font-bold text-yellow-400">User Admin Functions</h1>
        </div>

        <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg">
          <div className="grid gap-6">
            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Create New User</h2>
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-[#AB8F3D] text-black px-4 py-2 rounded hover:bg-[#E3B051] transition-colors"
              >
                {showCreateForm ? 'Cancel' : 'Create User'}
              </button>

              {showCreateForm && (
                <div className="mt-4 bg-[#162F35] p-6 rounded">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-yellow-400 mb-2">User ID:</label>
                      <input
                        type="text"
                        value={formData.userId}
                        readOnly
                        className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block text-yellow-400 mb-2">Wallet Address:</label>
                      <input
                        type="text"
                        value={formData.walletAddress}
                        onChange={(e) => setFormData({...formData, walletAddress: e.target.value})}
                        className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Enter wallet address"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-yellow-400 mb-2">Role:</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                      >
                        <option value="">Select a role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handleCreateUser}
                      disabled={!!selectedUser}
                      className="bg-[#AB8F3D] text-black px-6 py-2 rounded hover:bg-[#E3B051] transition-colors disabled:opacity-50"
                    >
                      Create User
                    </button>
                    <button
                      onClick={handleUpdateUser}
                      disabled={!selectedUser}
                      className="bg-[#0A3E45] text-yellow-400 px-6 py-2 rounded hover:bg-[#162F35] transition-colors border border-yellow-400 disabled:opacity-50"
                    >
                      Update User
                    </button>
                    <button
                      onClick={handleDeleteUser}
                      disabled={!selectedUser}
                      className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..." 
                    className="bg-[#0A3E45] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 w-64"
                  />
                </div>

                <div className="bg-[#162F35] p-4 rounded">
                  <h3 className="text-yellow-400 text-lg font-semibold mb-3">User List</h3>
                  {users.length === 0 ? (
                    <p className="text-gray-300">No users found</p>
                  ) : (
                    <div className="space-y-2">
                      {users
                        .filter(user => 
                          user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.role.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(user => (
                          <div 
                            key={user.userId}
                            onClick={() => {
                              setSelectedUser(user);
                              setFormData(user);
                              setShowCreateForm(true);
                            }}
                            className={`p-4 rounded cursor-pointer transition-colors ${
                              selectedUser?.userId === user.userId 
                                ? 'bg-[#AB8F3D] text-black' 
                                : 'bg-[#0A3E45] hover:bg-[#124450]'
                            }`}
                          >
                            <div className="font-bold">{user.walletAddress}</div>
                            <div className="text-sm text-gray-300">{user.role}</div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Role Management</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Configure User Roles</span>
                  <button className="bg-[#AB8F3D] text-black px-4 py-2 rounded hover:bg-[#E3B051] transition-colors">
                    Manage Roles
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">User Activity</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <p className="text-gray-300">No recent activity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 