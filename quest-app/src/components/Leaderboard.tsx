import React from 'react';


const Leaderboard: React.FC = () => {
  const players = [
    { rank: 1, name: 'Player 1', points: '492,301' },
    { rank: 2, name: 'Player 2', points: '382,050' },
    { rank: 3, name: 'Player 3', points: '289,538' },
    { rank: 4, name: 'Player 4', points: '102,419' },
    { rank: 5, name: 'Player 4', points: '98,013' },
  ];

  return (
    <div className="bg-teal-900 text-gold flex flex-col items-center p-4">
      {/* Leaderboard Table */}
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-black text-white text-lg font-bold rounded-full">
          <div className="flex-1 text-center px-4">Rank</div>
          <div className="flex-1 text-center px-4">User</div>
          <div className="flex-1 text-center px-4">Points</div>
        </div>
        {/* Player Rows */}
        {players.map((player, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 bg-black bg-opacity-80 text-gold text-lg rounded-full shadow-md mt-4"
          >
            <div className="flex-1 text-center px-4">{player.rank}</div>
            <div className="flex-1 text-center px-4">{player.name}</div>
            <div className="flex-1 text-center px-4">{player.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default Leaderboard;
