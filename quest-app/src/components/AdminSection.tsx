import React from 'react';

const AdminSection: React.FC = () => {
  const adminTiles = [
    { title: 'Event Admin Functions', description: 'Manage and configure event settings' },
    { title: 'Quest Definition and Setup', description: 'Create and modify quest parameters' },
    { title: 'User Admin Functions', description: 'Manage user accounts and permissions' },
    { title: 'Quest Event Management', description: 'Monitor and control ongoing quests' },
    { title: 'Sponsor Admin Management', description: 'Configure sponsor relationships and settings' },
    { title: 'User Quest Event Management', description: 'Track user participation and progress' },
    { title: 'Rewards Admin Management', description: 'Configure and distribute rewards' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {adminTiles.map((tile, index) => (
          <div 
            key={index} 
            className="bg-[#0F262B] p-6 rounded-lg shadow-lg cursor-pointer hover:bg-[#162A2F] transition-colors"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-yellow-400 text-xl font-bold">{tile.title}</h3>
            </div>
            <p className="mt-4 text-gray-300">{tile.description}</p>
            <a href="#" className="text-yellow-400 mt-4 inline-block hover:underline">
              Manage →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSection; 