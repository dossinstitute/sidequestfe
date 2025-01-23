// app/page.tsx
"use client"; // Ensures this is a Client Component

import React, { useState } from 'react';
import Header from '../components/Header';
import TabNavigation from '../components/TabNavigation';
import QuestsSection from '../components/QuestsSection';
import Leaderboard from '../components/Leaderboard';
import Image from 'next/image';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quests' | 'leaderboard' | 'airdrop'>('quests');

  return (
    <div className="min-h-screen bg-[#0A3E45] text-white font-sans">
      <Header />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto mt-12 px-4">
        {activeTab === 'quests' && <QuestsSection />}
        {activeTab === 'leaderboard' && (
          <div className="text-center mb-4">
            {/* Title */}
            <div className="flex justify-center items-center text-4xl font-bold text-yellow-400 mb-2">
              <Image src="/MedalIcon.png" alt="Medal" width={30} height={30} className="mx-2" />
              <span>Leaderboard</span>
              <Image src="/MedalIcon.png" alt="Medal" width={30} height={30} className="mx-2" />
            </div>
            {/* Leaderboard Component */}
            <div className="w-full max-w-3xl mx-auto mt-4">
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
