'use client';

import React, { useState, useEffect } from 'react';
import QuizStart from './components/QuizStart';
import QuizCard from './components/QuizCard';
import QuizEnd from './components/QuizEnd';
import Leaderboard from './components/Leaderboard';
import { toast } from 'react-toastify';

export default function Home() {
  
  const [num, setNum] = useState(0);  //  question number
  const [skipState, setSkipState] = useState(false); // is next button ready to work
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [scoreArr, setScoreArr] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState("");
  const [startQuiz, setStartQuiz] = useState(false) // actives onclick on start button
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [isQuestLoading, setIsQuestLoading] = useState(false);
  const [isResultSending, setIsResultSending] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const quizObj = quizQuestions[num < 10 ? num : 9];
  
  const handleStart = async () => {
    setIsQuestLoading(true);

    await fetch("https://gkhit.onrender.com/api/quiz_data")
      .then(response => response.json())
      .then(data => {
        if (data) setQuizQuestions(Array.isArray(data) ? data : [data]);
      })
      .catch(error => {
        console.error(error);
        return toast.error("Something went wrong, could not get quiz questions!!")
      })
      .finally(() => setIsQuestLoading(false));

    setStartQuiz(true);
    setStartTime(Date.now());
  };

  const optClick = (evt) => {
    setSkipState(true);
    setSelectedOpt(evt.target.textContent.substring(3).trim());
  };


  const nxtClick = () => {
    if (skipState && !isResultSending) {
      const newScoreArr = [...scoreArr, selectedOpt === quizObj.answer];
      setScoreArr(newScoreArr);
      setSkipState(false);
      setSelectedOpt("");
      setTimeout(() => {
        setNum(prevNum => {
          const nextNum = prevNum + 1;

          if (nextNum <= 9) return nextNum;

          const score = newScoreArr.filter(Boolean).length;
          const duration = Number((Date.now() - startTime) / 1000) - 0.5;

          if (!isResultSending) {
            setIsResultSending(true);

            fetch("https://gkhit.onrender.com/api/post_score", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, score, duration }) })
              .then(async res => {
                return res.json();
              })
              .then(data => {
                if (data?.message === "Rank improved") {
                  toast.success("Congratulations!! your rank is improved in leaderboard.");
                } else if (data?.message === "New user added!") {
                  toast.success("Congratulations!! you entered the leaderboard.");
                } else if (data?.message === "Could not rank") {
                  toast.warn("Oops!! You could not rank on leaderboard");
                }
                if (data?.leaderboard) {
                  setLeaderboard(data.leaderboard);
                };
              })
              .catch(error => {
                toast.error("Oops! something went wrong, could not load leaderboard!!");
                console.error(error);
              })
              .finally(() => setIsResultSending(false));
          }
          return nextNum;
        });
      }, 500);
    } else toast.warning("Please select any option!!");

    if (num + 1 !== 10) return;

  }
  const prevClick = () => {
    if (num > 0) {
      setSelectedOpt("");
      setNum(num - 1);
      setSkipState(false);
      setScoreArr(scoreArr.slice(0, -1))
    } else toast.warning("Can not go back, it is first quetion!!")
  }

  const handleReset = () => {
    setNum(0);
    setSkipState(false);
    setQuizQuestions([]);
    setScoreArr([]);
    setStartQuiz(false);
    setName("");
    setStartTime(null);
    setLeaderboard([]);
  }
  

  if (startQuiz && (!quizQuestions || (num < 10 && !quizQuestions[num]))) {
    return <div className='mt-8 text-white text-5xl text-center'>Loading...</div>;
  }
  return (
    <>
      {!startQuiz && <QuizStart handleStart={handleStart} setName={setName} isLoading={isQuestLoading} />}
      {startQuiz && (num <= 9 || isResultSending) && <QuizCard
        QNo={num + 1}
        quizObj={quizObj}
        startTime={startTime}
        selectedOpt={selectedOpt}
        skipState={skipState}
        optClick={optClick}
        nxtClick={nxtClick}
        prevClick={prevClick}
        isLoading={isResultSending}
      />}
      {num === 10 && !isResultSending && <>
        <QuizEnd score={scoreArr.filter(item => item).length} duration={Number((Date.now() - startTime) / 1000)} handleReset={handleReset} />
        <Leaderboard name={name} leaderboard={leaderboard} isLoading={isResultSending} />
      </>}
    </>
  );
}