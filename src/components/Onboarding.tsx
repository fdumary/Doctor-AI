import { useState } from 'react';
import type { UserProfile } from '../App';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export function Onboarding(props: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showDoctorLogin, setShowDoctorLogin] = useState(false);

  function updateAnswer(key: string, value: string) {
    const newAnswers = { ...answers };
    newAnswers[key] = value;
    setAnswers(newAnswers);
  }

  function calculateRiskProfile(): UserProfile {
    let riskScore = 0;
    
    if (answers.familyHistory === 'yes') riskScore = riskScore + 2;
    if (answers.healthConditions === 'more-than-one') riskScore = riskScore + 3;
    if (answers.healthConditions === 'one') riskScore = riskScore + 1;
    if (answers.waistWeight === 'yes') riskScore = riskScore + 2;
    if (answers.movement === 'sitting') riskScore = riskScore + 2;
    if (answers.sleep === 'exhausting') riskScore = riskScore + 1;
    if (answers.sugar === 'daily') riskScore = riskScore + 2;
    
    let riskLevel: 'stable' | 'watchful' | 'at-risk' = 'stable';
    if (riskScore >= 6) {
      riskLevel = 'at-risk';
    } else if (riskScore >= 3) {
      riskLevel = 'watchful';
    }
    
    const ageStr = answers.ageGroup || '30';
    const ageParts = ageStr.split('-');
    const ageNumStr = ageParts[0] || '30';
    const ageNum = parseInt(ageNumStr);
    const metabolicAge = ageNum + riskScore;
    
    return {
      lifestyle: answers.lifestyle || '',
      ageGroup: answers.ageGroup || '',
      height: answers.height || '',
      weight: answers.weight || '',
      familyHistory: answers.familyHistory || '',
      healthConditions: answers.healthConditions || '',
      waistWeight: answers.waistWeight || '',
      movement: answers.movement || '',
      sleep: answers.sleep || '',
      sugar: answers.sugar || '',
      riskLevel: riskLevel,
      metabolicAge: metabolicAge,
    };
  }

  function nextStep() {
    if (step === 7) {
      props.onComplete(calculateRiskProfile());
    } else {
      setStep(step + 1);
    }
  }

  const questions = [
    {
      title: "Who Are You?",
      subtitle: "Pick what best describes you right now",
      key: "lifestyle",
      options: [
        { label: "Active but inconsistent", value: "active-inconsistent" },
        { label: "Sit most of the day", value: "sitting" },
        { label: "Struggle with food choices", value: "food-struggle" },
        { label: "Stress runs my life", value: "stress" },
      ]
    },
    {
      title: "Age Group",
      subtitle: "This helps personalize your journey",
      key: "ageGroup",
      options: [
        { label: "Under 30", value: "30" },
        { label: "30-44", value: "30-44" },
        { label: "45-59", value: "45-59" },
        { label: "60 plus", value: "60" },
      ]
    },
    {
      title: "Family History",
      subtitle: "Has anyone in your close family had Type 2 Diabetes?",
      key: "familyHistory",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ]
    },
    {
      title: "Health Conditions",
      subtitle: "Have you been told you have high blood sugar or cholesterol?",
      key: "healthConditions",
      options: [
        { label: "None", value: "none" },
        { label: "One of these", value: "one" },
        { label: "More than one", value: "more-than-one" },
      ]
    },
    {
      title: "Body Shape",
      subtitle: "Do you gain weight easily around your waist?",
      key: "waistWeight",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ]
    },
    {
      title: "Daily Movement",
      subtitle: "On most days your movement looks like",
      key: "movement",
      options: [
        { label: "Mostly walking", value: "walking" },
        { label: "Active workouts", value: "active" },
        { label: "Mostly sitting", value: "sitting" },
      ]
    },
    {
      title: "Sleep Quality",
      subtitle: "Sleep on an average night feels like",
      key: "sleep",
      options: [
        { label: "Restful", value: "restful" },
        { label: "Okay", value: "okay" },
        { label: "Exhausting", value: "exhausting" },
      ]
    },
    {
      title: "Sugar Habits",
      subtitle: "Your relationship with sugar is best described as",
      key: "sugar",
      options: [
        { label: "Rare treat", value: "rare" },
        { label: "Occasional comfort", value: "occasional" },
        { label: "Daily habit", value: "daily" },
      ]
    },
  ];

  const currentQuestion = questions[step];
  const progressPercent = (step + 1) / 8 * 100;
  const progressWidth = progressPercent + '%';
  const questionNumber = step + 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">+</div>
          <span className="font-semibold text-lg">Doctor AI</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: progressWidth }}></div>
        </div>
        <p className="text-sm text-gray-500">
          Question {questionNumber} of 8
        </p>
      </div>

      <div className="flex-1 px-6 pb-6">
        <h2 className="text-2xl font-semibold mb-2">{currentQuestion.title}</h2>
        <p className="text-gray-600 mb-8">{currentQuestion.subtitle}</p>

        <div className="space-y-3">
          {currentQuestion.options.map(function(option) {
            const selected = answers[currentQuestion.key] === option.value;
            const buttonClass = selected ? 'w-full p-4 rounded-2xl border-2 border-blue-600 bg-blue-50 transition-all text-left' : 'w-full p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-blue-300 transition-all text-left';
            
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
      </div>
    </div>
  );
}