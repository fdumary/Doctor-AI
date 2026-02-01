import { useState } from 'react';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

export function WeeklyCheck(props: Props) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const symptoms = [
    { id: 'thirst', label: 'Increased thirst' },
    { id: 'urination', label: 'Frequent urination' },
    { id: 'fatigue', label: 'Unusual fatigue' },
    { id: 'vision', label: 'Blurry vision' },
    { id: 'none', label: 'None of these' },
  ];

  function toggleSymptom(id: string) {
    if (id === 'none') {
      setSelectedSymptoms(['none']);
    } else {
      const filtered = selectedSymptoms.filter(function(s) { return s !== 'none'; });
      if (selectedSymptoms.includes(id)) {
        setSelectedSymptoms(filtered.filter(function(s) { return s !== id; }));
      } else {
        setSelectedSymptoms([...filtered, id]);
      }
    }
  }

  function handleComplete() {
    props.onComplete();
  }

  const hasSymptoms = selectedSymptoms.length > 0 && !selectedSymptoms.includes('none');
  const hasNone = selectedSymptoms.includes('none');
  const canSubmit = selectedSymptoms.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 flex flex-col">
      <div className="p-6">
        <button 
          type="button"
          onClick={props.onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <span>Back</span>
        </button>
        
        <h1 className="text-2xl font-semibold mb-1">Weekly Body Signal Check</h1>
        <p className="text-gray-600 mb-4">Optional - Helps us spot early warnings</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-gray-700">
            This information adds early warning intelligence without replacing medical advice.
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6">
        <h2 className="text-xl font-semibold mb-8">
          Have you noticed any of these lately?
        </h2>

        <div className="space-y-3">
          {symptoms.map(function(symptom) {
            const isSelected = selectedSymptoms.includes(symptom.id);
            let borderClass = 'border-gray-200 bg-white hover:border-gray-400';
            if (isSelected && symptom.id === 'none') {
              borderClass = 'border-green-600 bg-green-50';
            } else if (isSelected) {
              borderClass = 'border-orange-600 bg-orange-50';
            }
            const fullClass = 'w-full p-5 rounded-2xl border-2 transition-all text-left font-medium ' + borderClass;
            
            return (
              <button
                key={symptom.id}
                type="button"
                onClick={function() { toggleSymptom(symptom.id); }}
                className={fullClass}
              >
                {symptom.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleComplete}
          disabled={!canSubmit}
          className={canSubmit ? 'w-full mt-8 p-5 rounded-2xl font-semibold transition-all bg-blue-600 text-white hover:bg-blue-700' : 'w-full mt-8 p-5 rounded-2xl font-semibold transition-all bg-gray-200 text-gray-400 cursor-not-allowed'}
        >
          Complete Weekly Check
        </button>

        {hasSymptoms ? (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Note:</span> We will flag this for your healthcare provider. 
              If symptoms are severe, please seek immediate medical attention.
            </p>
          </div>
        ) : null}

        {hasNone ? (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
            <p className="text-sm text-gray-700">Great to hear! Keep up the good work.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}