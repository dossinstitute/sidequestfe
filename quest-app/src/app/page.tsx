"use client"; // This directive makes the component a Client Component

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '../components/Header';
import Leaderboard from '../components/Leaderboard';

const Home: React.FC = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'quests' | 'leaderboard' | 'airdrop'>('quests');

  return (
    <div className="min-h-screen bg-[#0A3E45] text-white font-sans">
      {/* Header */}
      <Header />
      
      {/* Tabs */}
      <div className="flex justify-center space-x-4 mt-10">
        <button 
          className={`py-2 px-6 rounded-md ${activeTab === 'quests' ? 'bg-[#AB8F3D] text-black' : 'bg-gray-600 text-gray-300'}`}
          onClick={() => setActiveTab('quests')}
        >
          Quests
        </button>
        <button 
          className={`py-2 px-6 rounded-md ${activeTab === 'leaderboard' ? 'bg-[#E3B051] text-black' : 'bg-gray-600 text-gray-300'}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
        <button 
          className={`py-2 px-6 rounded-md ${activeTab === 'airdrop' ? 'bg-[#E3B051] text-black' : 'bg-gray-600 text-gray-300'}`}
          onClick={() => setActiveTab('airdrop')}
        >
          Airdrop
        </button>
      </div>

      {/* Quests Section */}
      <main className="container mx-auto mt-12 px-4">
        {activeTab === 'quests' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-yellow-400 text-xl font-bold">Quest</h3>
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm">50 Points</span>
              </div>
              <p className="mt-4 text-gray-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
              <a href="#" className="text-yellow-400 mt-4 inline-block hover:underline">Go to Quest →</a>
              {/* Progress Bar */}
              <div className="container mx-auto mt-12 px-4">
                <div className="bg-gray-300 h-3 rounded-full">
                  <div className="bg-yellow-400 h-full w-1/2 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-yellow-400 text-xl font-bold">Quest</h3>
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm">50 Points</span>
              </div>
              <p className="mt-4 text-gray-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
              <a href="#" className="text-yellow-400 mt-4 inline-block hover:underline">Go to Quest →</a>
              {/* Progress Bar */}
              <div className="container mx-auto mt-12 px-4">
                <div className="bg-gray-300 h-3 rounded-full">
                  <div className="bg-yellow-400 h-full w-1/2 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'leaderboard' && (
          <div className="text-center mb-4">{/* Reduced mb-8 to mb-4 */}
            {/* Title */}
            <div className="flex justify-center items-center text-4xl font-bold text-yellow-400 mb-2">
              <Image src="/MedalIcon.png" alt="Medal" width={30} height={30} className="mx-2" />
              <span>Leaderboard</span>
              <Image src="/MedalIcon.png" alt="Medal" width={30} height={30} className="mx-2" />
            </div>
            {/* Leaderboard Component */}
            <div className="w-full max-w-3xl mx-auto mt-4">{/* Added max-width and mx-auto */}
              <Leaderboard />
            </div>
          </div>
)}

        {activeTab === 'airdrop' && (
          <div className="text-center text-yellow-400 text-2xl">Airdrop content goes here</div>
        )}
      </main>
    </div>
  );
};

export default Home;

