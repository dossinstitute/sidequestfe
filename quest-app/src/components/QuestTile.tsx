import React from "react";

const QuestTile = () => {
    return (
    <div className="bg-[#0F262B] p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
            <h3 className="text-yellow-400 text-xl font-bold">Quest</h3>
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm">50 Points</span>
        </div>
            <p className="mt-4 text-gray-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <a href="#" className="text-yellow-400 mt-4 inline-block hover:underline">Go to Quest →</a>
            {/* Progress Bar */}
            <div className="container mx-auto mt-12 px-4">
                <div className="bg-gray-300 h-3 rounded-full">
                    <div className="bg-yellow-400 h-full w-1/2 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default QuestTile;
