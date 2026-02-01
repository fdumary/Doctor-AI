import { useState } from 'react';
import type { DailyData } from '../App';

interface Props {
  onComplete: (data: DailyData) => void;
}

export function WatchDailyCheckIn(props: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const updateAnswer = function(key: string, value: string) {
    const newAnswers = { ...answers };
    newAnswers[key] = value;
    setAnswers(newAnswers);
  };

  const nextStep = function() {
    if (step === 4) {
      const dailyData: DailyData = {
        bodyFeel: answers.bodyFeel || 'normal',
        movement: answers.movement || 'some',
        food: answers.food || 'mixed',
        stress: answers.stress || 'moderate',
        sleep: answers.sleep || 'okay',
        date: new Date().toDateString(),
      };
      props.onComplete(dailyData);
    } else {
      setStep(step + 1);
    }
  };

  const questions = [
    {
      title: 'Body?',
      key: 'bodyFeel',
      options: [
        { label: '💪', value: 'energetic' },
        { label: '😊', value: 'normal' },
        { label: '😴', value: 'tired' },
      ],
    },
    {
      title: 'Move?',
      key: 'movement',
      options: [
        { label: '🏃', value: 'enough' },
        { label: '🚶', value: 'some' },
        { label: '🪑', value: 'barely' },
      ],
    },
    {
      title: 'Food?',
      key: 'food',
      options: [
        { label: '🥗', value: 'balanced' },
        { label: '🍕', value: 'mixed' },
        { label: '🍭', value: 'sugary' },
      ],
    },
    {
      title: 'Stress?',
      key: 'stress',
      options: [
        { label: '😌', value: 'calm' },
        { label: '😐', value: 'moderate' },
        { label: '😰', value: 'high' },
      ],
    },
    {
      title: 'Sleep?',
      key: 'sleep',
      options: [
        { label: '✨', value: 'good' },
        { label: '👍', value: 'okay' },
        { label: '😞', value: 'poor' },
      ],
    },
  ];

  const currentQuestion = questions[step];
  const progressPercent = ((step + 1) / 5) * 100;
  const progressWidth = progressPercent + '%';

  return (
    <div className="h-full bg-black flex flex-col p-3">
      <div className="mb-3">
        <div className="w-full bg-gray-700 rounded-full h-1 mb-2">
          <div 
            className="bg-green-500 h-1 rounded-full transition-all duration-300" 
            style={{ width: progressWidth }}
          ></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-white text-center font-semibold text-sm mb-4">
          {currentQuestion.title}
        </p>

        <div className="space-y-2 w-full">
          {currentQuestion.options.map(function(option) {
            const selected = answers[currentQuestion.key] === option.value;
            const buttonClass = selected
              ? 'w-full p-3 rounded-full bg-green-600 text-white text-center text-2xl'
              : 'w-full p-3 rounded-full bg-gray-800 text-white text-center text-2xl hover:bg-gray-700';
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={function() {
                  updateAnswer(currentQuestion.key, option.value);
                  setTimeout(nextStep, 300);
                }}
                className={buttonClass}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
