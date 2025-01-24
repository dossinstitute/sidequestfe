// components/TabNavigation.tsx
import React from 'react';

interface TabNavigationProps {
  activeTab: 'quests' | 'leaderboard' | 'airdrop';
  setActiveTab: (tab: 'quests' | 'leaderboard' | 'airdrop') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center space-x-4 mt-10">
      <button 
        className={`py-2 px-6 rounded-md ${activeTab === 'quests' ? 'bg-[#AB8F3D] text-black' : 'bg-gray-600 text-gray-300'}`}
        onClick={() => setActiveTab('quests')}
      >
        Quests
      </button>
      {/* Similar buttons for leaderboard and airdrop */}
    </div>
  );
};

export default TabNavigation;