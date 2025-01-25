import React, { useState } from 'react';

interface Quest {
  id: string;
  title: string;
  points: number;
  description: string;
}

const AdminSection: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [newQuest, setNewQuest] = useState<Omit<Quest, 'id'>>({
    title: '',
    points: 0,
    description: ''
  });

  const handleAddQuest = (e: React.FormEvent) => {
    e.preventDefault();
    const quest: Quest = {
      id: Date.now().toString(),
      ...newQuest
    };
    setQuests([...quests, quest]);
    setNewQuest({ title: '', points: 0, description: '' });
  };

  const handleDeleteQuest = (id: string) => {
    setQuests(quests.filter(quest => quest.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Admin Dashboard</h2>
      
      {/* Add Quest Form */}
      <form onSubmit={handleAddQuest} className="bg-[#0F262B] p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">Add New Quest</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Quest Title</label>
            <input
              type="text"
              value={newQuest.title}
              onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Points</label>
            <input
              type="number"
              value={newQuest.points}
              onChange={(e) => setNewQuest({ ...newQuest, points: Number(e.target.value) })}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              value={newQuest.description}
              onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white h-24"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-400 text-black px-4 py-2 rounded font-bold hover:bg-yellow-500"
          >
            Add Quest
          </button>
        </div>
      </form>

      {/* Quest List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">Manage Quests</h3>
        {quests.map(quest => (
          <div key={quest.id} className="bg-[#0F262B] p-4 rounded-lg flex justify-between items-center">
            <div>
              <h4 className="text-yellow-400 font-bold">{quest.title}</h4>
              <p className="text-gray-300 text-sm">{quest.description}</p>
              <span className="text-yellow-400 text-sm">{quest.points} Points</span>
            </div>
            <button
              onClick={() => handleDeleteQuest(quest.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSection; 