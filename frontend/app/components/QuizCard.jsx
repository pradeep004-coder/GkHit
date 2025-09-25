import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinner';

export default function QuizCard({ quizObj, QNo, selectedOpt, skipState, optClick, prevClick, nxtClick, isLoading, startTime }) {

  const [timerStamp, setTimerStamp] = useState(Date.now() - startTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerStamp(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const toTimeString = (millis) => {
    const timestamp = new Date(millis);
    const hours = timestamp.getUTCHours();
    const minutes = timestamp.getUTCMinutes();
    const seconds = Math.floor((timestamp / 1000) % 60);
    return (!hours ? "" : (hours < 10 ? `0${hours} : ` : `${hours} : `))
      + (minutes < 10 ? `0${minutes} : ` : `${minutes} : `)
      + (seconds < 10 ? "0" + seconds : seconds);
  }

  return (
    <div className="flex justify-center mt-6 sm:mt-10">
      <div className="w-full lg:w-2/3 mx-2 md:mx-4 bg-zinc-900 rounded-2xl shadow-lg p-8">

        {/* Question Number and Timer */}
        <div className="flex justify-between">
          <div className="bg-zinc-800 rounded-full px-3 py-1 text-lg text-right font-semibold text-white">
            {QNo} / 10
          </div>
          <div className='text-white text-lg'>{toTimeString(timerStamp)}</div>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <h5 className="text-2xl font-bold text-white">{quizObj.question}</h5>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-6">
          {quizObj.options.map((opt, index) => (
            <button
              key={index}
              onClick={optClick}
              className={`w-full px-4 py-2 text-white text-xl text-left rounded-lg ${selectedOpt === opt ? 'bg-zinc-600 font-semibold' : 'bg-zinc-800 hover:bg-zinc-700'} transition-all`}
            >
              {String.fromCharCode(97 + index)}) {opt}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevClick}
            disabled={QNo === 1}
            className={`px-4 py-2 rounded-lg font-semibold transition ${QNo === 1
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-green-900 text-white hover:bg-green-700"
              }`}
          >
            Previous
          </button>

          <button
            onClick={nxtClick}
            className={`px-4 py-2 rounded-lg font-semibold ${skipState ? 'bg-green-900 text-white hover:bg-green-700' : 'bg-gray-500 text-gray-300 cursor-not-allowed'} transition`}
          >
            {QNo < 10 ?
              "Next"
              : isLoading ?
                <ClipLoader
                  color="gray"
                  loading={isLoading}
                  size={16}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
                : "See Result"}
          </button>
        </div>
      </div>
    </div>
  );
}
