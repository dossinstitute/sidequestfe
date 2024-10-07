// pages/index.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center custom-background">
      {/* Header Section */}
      <header className="w-full text-white py-4 text-center">
        <nav className="container mx-auto">
          <ul className="flex justify-center space-x-4">
            <li className="custom-header">Home</li>
            <li className="custom-header">Resources</li>
            <li className="custom-header">Blog</li>
            <li className="custom-header">Contact</li>
          </ul>
        </nav>
      </header>

      {/* Main Content Section */}
      <main className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Quests</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-black text-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold">Quest 1</h2>
            <p className="mt-2">Lorem ipsum dolor sit amet...</p>
            <button className="custom-button mt-4">Start Quest</button>
          </div>
          {/* More Quest Cards */}
        </div>
      </main>
    </div>
  );
};

export default Home;
