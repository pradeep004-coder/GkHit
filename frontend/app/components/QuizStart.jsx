"use client"
import React from 'react';
import { useState } from 'react';
import ClipLoader from 'react-spinner';

export default function QuizStart({ handleStart, setName, isLoading }) {
    const [isNameOk, setIsNameOk] = useState(false);
    const nameRegex = /^[a-zA-Z\s']{4,}$/;

    const handleNameChange = (e) => {
        const value = e.target.value.trim()
        const capitalizedValue = value
            .split(" ")
            .map(item => item.charAt(0).toUpperCase() + item.slice(1))
            .join(" ")

        setName(capitalizedValue);
        if (nameRegex.test(value) && value.length >= 4 && !value.includes("  ")) {
            setIsNameOk(true);
        }
        else {
            setIsNameOk(false);
        }
    }
    return (
        <div className='h-[90vh] flex flex-col items-center gap-5'>
            <h2 className='text-white mt-[20vh] text-8xl font-bold'>GkHit</h2>
            <div className='flex flex-col mx-2'>
                <input type='text' placeholder='enter your name...' onChange={handleNameChange} className='border border-zinc-200 text-white text-2xl p-2 rounded-lg' />
                {!isNameOk && (
                    <p className="text-zinc-400 text-sm">
                        Enter your real name (it will appear on leaderboard if you score well).
                    </p>
                )}
            </div>
            {isNameOk && <button className='mt-2 px-4 py-2 rounded-2xl bg-green-900 text-white font-bold bigSmall' onClick={handleStart}>
                {isLoading ?
                    <ClipLoader
                        color="gray"
                        loading={isLoading.toString()}
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                    : "START"}
            </button>}
        </div>
    )
}