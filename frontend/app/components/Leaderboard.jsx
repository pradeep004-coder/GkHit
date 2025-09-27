"use client";
import React from "react";

const Leaderboard = ({ name, leaderboard, isLoading }) => {

    const toTimeString = (sec) => {
        const timestamp = new Date(sec * 1000);
        const hours = timestamp.getUTCHours();
        const minutes = timestamp.getUTCMinutes();
        const seconds = Math.floor(timestamp / 1000) % 60;
        return (!hours ? "" : (hours < 10 ? `0${hours} : ` : `${hours} : `))
            + (minutes < 10 ? `0${minutes} : ` : `${minutes} : `)
            + (seconds < 10 ? "0" + seconds : seconds);
    }

    return (
        <div className="text-white max-w-md mx-auto mt-4 p-6 shadow-lg rounded-2xl">
            <h2 className="text-2xl font-bold mb-2 text-center">Leaderboard</h2>
            <table className="w-full border-collapse text-center">
                <thead>
                    <tr className="bg-gray-800">
                        <th className="border p-2">Rank</th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Duration</th>
                        <th className="border p-2">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && leaderboard.map(( entry, index) => (
                        <tr
                            key={index}
                            className={`${entry.name === name ? "bg-blue-950" : ""}`}
                        >
                            <td className="border p-2">{index + 1}</td>
                            <td className="border p-2">{entry.name + (entry.name === name ? " (you)" : "")}</td>
                            <td className="border p-2">{toTimeString(entry.duration)}</td>
                            <td className="border p-2">{entry.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {!leaderboard.length && <div className="text-center bg-gray-800">Could not load Leaderboard!!!</div>}
        </div>
    );
};

export default Leaderboard;
