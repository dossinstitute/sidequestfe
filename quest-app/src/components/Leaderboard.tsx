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
    <div className="bg-teal-900 text-gold min-h-screen flex flex-col items-center p-4">
      {/* Leaderboard Table */}
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-3 gap-4 p-4 bg-black text-white text-lg rounded-t-lg">
          <div className="text-center">Rank</div>
          <div className="text-center">User</div>
          <div className="text-center">Points</div>
        </div>
        {players.map((player, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-black bg-opacity-80 text-gold text-lg">
            <div className="text-center">{player.rank}</div>
            <div className="text-center">{player.name}</div>
            <div className="text-center">{player.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
