'use client';
import React, { useState, useEffect, use } from 'react';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const page = () => {
  const { data, error } = useSWR('http://localhost:8080/question/allQuestions', fetcher)
 
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  console.log(data);

  return (
    <div className='container'>
        <h1>Questions</h1>
        <div className="collapse bg-base-200">
            <input type="checkbox" /> 
            <div className="collapse-title text-xl font-medium">
                 Click to show all questions
            </div>
            <div className="collapse-content"> 
            {data.map((question, idx) => (
                <div className='quiz-container'>
                <h3 key={idx}>{question.questionTitle}</h3>
                {
                [question.option1,question.option2, question.option3, question.option4].map((option, idx2) => (
                    <li
                        key={idx2}
                    >
                    <span>{option}</span>
                     </li>
                ))}
                </div>
            ))}
            </div>
        </div>
    </div>
  );
};

export default page;

