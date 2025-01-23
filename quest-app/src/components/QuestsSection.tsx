// components/QuestsSection.tsx
import React from 'react';
import QuestCard from './QuestCard';

const QuestsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <QuestCard 
        title="Quest"
        points={50}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
        progress={50}
      />
      {/* Add more QuestCard components as needed */}
    </div>
  );
};

export default QuestsSection;