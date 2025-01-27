"use client";

import Header from '@/components/Header';

export default function UserAdminPage() {
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
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">User Management</h2>
              <div className="bg-[#162F35] p-4 rounded">
                <div className="flex justify-between items-center mb-4">
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="bg-[#0A3E45] text-white px-4 py-2 rounded w-64"
                  />
                  <button className="bg-[#AB8F3D] text-black px-4 py-2 rounded hover:bg-[#E3B051] transition-colors">
                    Add User
                  </button>
                </div>
                <p className="text-gray-300">No users found</p>
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