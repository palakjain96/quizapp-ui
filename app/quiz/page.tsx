'use client';
import React, { useState } from 'react';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const page = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [submit, setSubmit] = useState(false);
 
  const { data, error } = useSWR('http://localhost:8080/quiz/get/1', fetcher)
 
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  
  const question = data[activeQuestion];


  // Submit answers
  const submitAnswer = async () => {
    const res = await fetch('http://localhost:8080/quiz/submit/1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answers),
    });
    const data = await res.json();
    setScore(data);
    setSubmit(true);
  }

  //   Select and check answer
  const onAnswerSelected = (answer, idx, questionIndex) => {
    setChecked(true);
    setSelectedAnswerIndex(idx);
    const resp = {
        "id": questionIndex,
        "response": answer
    }
    setAnswers([...answers, resp]);
    setSelectedAnswer('true');
  };

  // Calculate score and increment to next question
  const nextQuestion = () => {
    setSelectedAnswerIndex(null);
    if (activeQuestion !== data.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setActiveQuestion(0);
      setShowResult(true);
    }
    setChecked(false);
  };

  return (
    <div className='container'>
      <h1>Quiz Page</h1>
      <div>
        <h2>
          Question: {activeQuestion + 1}
          <span>/{data.length}</span>
        </h2>
      </div>
      <div>
        {!showResult ? (
          <div className='quiz-container'>
            <h3>{question.questionTitle}</h3>
            {
                [question.option1,question.option2, question.option3, question.option4].map((option, idx) => (
                    <li
                        key={idx}
                        onClick={() => onAnswerSelected(option, idx, question.id)}
                        className={
                            selectedAnswerIndex === idx ? 'li-selected' : 'li-hover'
                        }
                    >
                    <span>{option}</span>
                     </li>
                ))}
            {checked ? (
              <button onClick={nextQuestion} className='btn'>
                {activeQuestion === data.length - 1 ? 'Finish' : 'Next'}
              </button>
            ) : (
              <button onClick={nextQuestion} disabled className='btn-disabled'>
                {' '}
                {activeQuestion === data.length - 1 ? 'Finish' : 'Next'}
              </button>
            )}
          </div>
        ) : (
          <div className='quiz-container'> 
            {submit ? (
                <><h3>Results</h3><h4>Your score is: {score}</h4><button onClick={() => window.location.reload()}>Restart</button></>
              ) : (
                <><h3>Results</h3><button onClick={submitAnswer}>Submit</button><button onClick={() => window.location.reload()}>Restart</button></>
              )}
          </div>  
        )}
      </div>
    </div>
  );
};

export default page;