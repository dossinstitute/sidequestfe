// components/TabNavigation.tsx
import React from 'react';

interface TabNavigationProps {
  activeTab: 'quests' | 'leaderboard' | 'airdrop';
  setActiveTab: React.Dispatch<React.SetStateAction<'quests' | 'leaderboard' | 'airdrop'>>;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center space-x-4 mt-10">
      <button
        className={`py-2 px-6 rounded-md ${
          activeTab === 'quests' ? 'bg-[#AB8F3D] text-black' : 'bg-gray-600 text-gray-300'
        }`}
        onClick={() => setActiveTab('quests')}
      >
        Quests
      </button>
      <button
        className={`py-2 px-6 rounded-md ${
          activeTab === 'leaderboard' ? 'bg-[#E3B051] text-black' : 'bg-gray-600 text-gray-300'
        }`}
        onClick={() => setActiveTab('leaderboard')}
      >
        Leaderboard
      </button>
      <button
        className={`py-2 px-6 rounded-md ${
          activeTab === 'airdrop' ? 'bg-[#E3B051] text-black' : 'bg-gray-600 text-gray-300'
        }`}
        onClick={() => setActiveTab('airdrop')}
      >
        Airdrop
      </button>
    </div>
  );
};

export default TabNavigation;
