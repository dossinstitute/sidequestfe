// app/Admin/page.tsx
"use client";

import Header from '@/components/Header';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0A3E45] text-white font-sans">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-yellow-400 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Event Admin Functions */}
          <Link href="/Admin/event-admin" className="block">
            <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg hover:bg-[#162F35] transition-colors">
              <div className="flex justify-between items-center">
                <h3 className="text-yellow-400 text-xl font-bold">Event Admin Functions</h3>
              </div>
              <p className="mt-4 text-gray-300">Manage and oversee event creation, modification, and deletion.</p>
              <span className="text-yellow-400 mt-4 inline-block hover:underline">Access →</span>
            </div>
          </Link>

          {/* Quest Definition and Setup */}
          <Link href="/Admin/quest-setup" className="block">
            <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg hover:bg-[#162F35] transition-colors">
              <div className="flex justify-between items-center">
                <h3 className="text-yellow-400 text-xl font-bold">Quest Definition and Setup</h3>
              </div>
              <p className="mt-4 text-gray-300">Create and configure new quests, set requirements and rewards.</p>
              <span className="text-yellow-400 mt-4 inline-block hover:underline">Access →</span>
            </div>
          </Link>

          {/* User Admin Functions */}
          <Link href="/Admin/user-admin" className="block">
            <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg hover:bg-[#162F35] transition-colors">
              <div className="flex justify-between items-center">
                <h3 className="text-yellow-400 text-xl font-bold">User Admin Functions</h3>
              </div>
              <p className="mt-4 text-gray-300">Manage user accounts, permissions, and roles.</p>
              <span className="text-yellow-400 mt-4 inline-block hover:underline">Access →</span>
            </div>
          </Link>

          {/* Quest Event Management */}
          <Link href="/Admin/quest-management" className="block">
            <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg hover:bg-[#162F35] transition-colors">
              <div className="flex justify-between items-center">
                <h3 className="text-yellow-400 text-xl font-bold">Quest Event Management</h3>
              </div>
              <p className="mt-4 text-gray-300">Monitor and manage ongoing quest events and activities.</p>
              <span className="text-yellow-400 mt-4 inline-block hover:underline">Access →</span>
            </div>
          </Link>

          {/* Sponsor Admin Management */}
          <Link href="/Admin/sponsor-admin" className="block">
            <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg hover:bg-[#162F35] transition-colors">
              <div className="flex justify-between items-center">
                <h3 className="text-yellow-400 text-xl font-bold">Sponsor Admin Management</h3>
              </div>
              <p className="mt-4 text-gray-300">Manage sponsor relationships, contracts, and integrations.</p>
              <span className="text-yellow-400 mt-4 inline-block hover:underline">Access →</span>
            </div>
          </Link>

          {/* User Quest Event Management */}
          <Link href="/Admin/user-quest-management" className="block">
            <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg hover:bg-[#162F35] transition-colors">
              <div className="flex justify-between items-center">
                <h3 className="text-yellow-400 text-xl font-bold">User Quest Event Management</h3>
              </div>
              <p className="mt-4 text-gray-300">Track and manage user participation in quest events.</p>
              <span className="text-yellow-400 mt-4 inline-block hover:underline">Access →</span>
            </div>
          </Link>

          {/* Rewards Admin Management */}
          <Link href="/Admin/rewards-admin" className="block">
            <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg hover:bg-[#162F35] transition-colors">
              <div className="flex justify-between items-center">
                <h3 className="text-yellow-400 text-xl font-bold">Rewards Admin Management</h3>
              </div>
              <p className="mt-4 text-gray-300">Configure and manage reward distribution and tracking.</p>
              <span className="text-yellow-400 mt-4 inline-block hover:underline">Access →</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
