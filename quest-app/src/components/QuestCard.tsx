// components/QuestCard.tsx
import React from 'react';

interface QuestCardProps {
  title: string;
  points: number;
  description: string;
  progress: number;
}

const QuestCard: React.FC<QuestCardProps> = ({ title, points, description, progress }) => {
  return (
    <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-yellow-400 text-xl font-bold">{title}</h3>
        <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm">{points} Points</span>
      </div>
      <p className="mt-4 text-gray-300">{description}</p>
      <a href="#" className="text-yellow-400 mt-4 inline-block hover:underline">Go to Quest →</a>
      <div className="container mx-auto mt-12 px-4">
        <div className="bg-gray-300 h-3 rounded-full">
          <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default QuestCard;