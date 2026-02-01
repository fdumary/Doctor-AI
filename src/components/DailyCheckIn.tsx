import { useState } from 'react';
import type { DailyData } from '../App';

interface Props {
  onComplete: (data: DailyData) => void;
  onBack: () => void;
}

export function DailyCheckIn(props: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  function updateAnswer(key: string, value: string) {
    const newAnswers = { ...answers };
    newAnswers[key] = value;
    setAnswers(newAnswers);
  }

  function nextStep() {
    if (step === 4) {
      const data: DailyData = {
        bodyFeel: answers.bodyFeel || '',
        movement: answers.movement || '',
        food: answers.food || '',
        stress: answers.stress || '',
        sleep: answers.sleep || '',
        date: new Date().toDateString(),
      };
      props.onComplete(data);
    } else {
      setStep(step + 1);
    }
  }

  const questions = [
    {
      title: "How did your body feel today?",
      key: "bodyFeel",
      options: [
        { label: "Light and energetic", value: "energetic" },
        { label: "Normal", value: "normal" },
        { label: "Heavy or tired", value: "tired" },
      ]
    },
    {
      title: "Movement Today",
      key: "movement",
      options: [
        { label: "I moved enough", value: "enough" },
        { label: "Some movement", value: "some" },
        { label: "Barely moved", value: "barely" },
      ]
    },
    {
      title: "Food Today Felt",
      key: "food",
      options: [
        { label: "Balanced", value: "balanced" },
        { label: "Mixed", value: "mixed" },
        { label: "Sugary or heavy", value: "sugary" },
      ]
    },
    {
      title: "Stress Level Right Now",
      key: "stress",
      options: [
        { label: "Calm", value: "calm" },
        { label: "Moderate", value: "moderate" },
        { label: "High", value: "high" },
      ]
    },
    {
      title: "Sleep Last Night",
      key: "sleep",
      options: [
        { label: "Good", value: "good" },
        { label: "Okay", value: "okay" },
        { label: "Poor", value: "poor" },
      ]
    },
  ];

  const currentQuestion = questions[step];
  const progressPercent = (step + 1) / 5 * 100;
  const progressWidth = progressPercent + '%';
  const questionNumber = step + 1;

  let message = "No judgement here - just patterns.";
  if (step === 1) message = "Every bit of movement counts.";
  if (step === 2) message = "Tomorrow is always a fresh start.";
  if (step === 3) message = "Your feelings matter.";
  if (step === 4) message = "Almost done! You are doing great.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
      <div className="p-6">
        <button 
          type="button"
          onClick={props.onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <span>Back</span>
        </button>
        
        <h1 className="text-2xl font-semibold mb-1">Daily Check-In</h1>
        <p className="text-gray-600 mb-6">Just 60 seconds</p>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: progressWidth }}></div>
        </div>
        <p className="text-sm text-gray-500">
          {questionNumber} of 5
        </p>
      </div>

      <div className="flex-1 px-6 pb-6">
        <h2 className="text-2xl font-semibold mb-8">{currentQuestion.title}</h2>

        <div className="space-y-3">
          {currentQuestion.options.map(function(option) {
            const selected = answers[currentQuestion.key] === option.value;
            const buttonClass = selected ? 'w-full p-5 rounded-2xl border-2 border-blue-600 bg-blue-50 transition-all text-left font-medium' : 'w-full p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-blue-300 transition-all text-left font-medium';
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={function() {
                  updateAnswer(currentQuestion.key, option.value);
                  setTimeout(nextStep, 200);
                }}
                className={buttonClass}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-white rounded-xl opacity-60">
          <p className="text-sm text-gray-700 text-center italic">{message}</p>
        </div>
      </div>
    </div>
  );
}