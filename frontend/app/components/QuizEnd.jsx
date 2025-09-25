import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function QuizEnd({ score, handleReset, totalQ = 10 }) {



    return (
        <div className="flex flex-col items-center mt-16">
            <div
                className="w-full max-w-lg bg-zinc-900 rounded-2xl shadow-lg p-8 text-center"
            >
                <h2 className="text-4xl font-bold text-white underline mb-6">Result!</h2>

                <div className="text-2xl text-white mb-3">
                    Total Questions: {totalQ}
                </div>

                <div className="text-2xl text-green-400 mb-3">
                    Correct Answers: {score}
                </div>

                <div className="text-2xl text-red-400">
                    Wrong Answers: {totalQ - score}
                </div>
            </div>
            <button className='w-fit mt-4 px-4 py-2 rounded-2xl bg-green-900 text-white font-bold cursor-pointer bigSmall' onClick={handleReset}>Play Again</button>
        </div>
    );
}
