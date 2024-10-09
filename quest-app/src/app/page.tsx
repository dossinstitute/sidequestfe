import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A3E45] text-white font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-[#123B47]">
        <div className="flex items-center">
          <img src="/compass-logo.png" alt="Logo" className="w-10 h-10" />
          <span className="ml-4 bg-yellow-400 text-black py-2 px-4 rounded-full font-bold">50</span>
        </div>
        <nav className="flex space-x-6">
          <a href="#" className="text-white hover:text-yellow-400">Home</a>
          <a href="#" className="text-white hover:text-yellow-400">Resources</a>
          <a href="#" className="text-white hover:text-yellow-400">Blog</a>
          <a href="#" className="text-white hover:text-yellow-400">Contact</a>
        </nav>
        <img src="/metamask-logo.png" alt="MetaMask Logo" className="w-10 h-10" />
      </header>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mt-10">
        <button className="bg-[#AB8F3D] text-black py-2 px-6 rounded-md">Quests</button>
        <button className="bg-[#E3B051] text-black py-2 px-6 rounded-md">Leaderboard</button>
        <button className="bg-[#E3B051] text-black py-2 px-6 rounded-md">Airdrop</button>
      </div>

      {/* Quests Section */}
      <main className="container mx-auto mt-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Quest Card 1 */}
          <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-yellow-400 text-xl font-bold">Quest</h3>
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm">50 Points</span>
            </div>
            <p className="mt-4 text-gray-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <a href="#" className="text-yellow-400 mt-4 inline-block hover:underline">Go to Quest →</a>
          </div>

          {/* Quest Card 2 */}
          <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-yellow-400 text-xl font-bold">Quest</h3>
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm">50 Points</span>
            </div>
            <p className="mt-4 text-gray-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <a href="#" className="text-yellow-400 mt-4 inline-block hover:underline">Go to Quest →</a>
          </div>

          {/* Add more quest cards as needed */}
        </div>
      </main>

      {/* Progress Bar */}
      <div className="container mx-auto mt-12 px-4">
        <div className="bg-gray-300 h-3 rounded-full">
          <div className="bg-yellow-400 h-full w-1/2 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
