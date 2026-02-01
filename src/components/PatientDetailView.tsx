import type { PatientRecord } from '../App';

interface Props {
  patient: PatientRecord;
  onBack: () => void;
}

export function PatientDetailView(props: Props) {
  const patient = props.patient;
  const profile = patient.profile;
  
  let riskColorClass = 'text-green-600 bg-green-50 border-green-200';
  let riskIcon = '✔';
  let riskMessage = 'Metabolically stable with healthy patterns.';
  
  if (profile.riskLevel === 'watchful') {
    riskColorClass = 'text-yellow-600 bg-yellow-50 border-yellow-200';
    riskIcon = '⚡';
    riskMessage = 'Early signals detected. Monitoring recommended.';
  } else if (profile.riskLevel === 'at-risk') {
    riskColorClass = 'text-red-600 bg-red-50 border-red-200';
    riskIcon = '!';
    riskMessage = 'Requires immediate attention and intervention.';
  }

  const riskClass = 'p-6 rounded-2xl border-2 ' + riskColorClass;

  const recentHistory = patient.dailyHistory.slice(-7);
  const totalCheckIns = patient.dailyHistory.length;
  const compliancePercent = totalCheckIns >= 7 ? 100 : Math.round((totalCheckIns / 7) * 100);

  let avgEnergyScore = 0;
  let avgStressScore = 0;
  
  if (recentHistory.length > 0) {
    for (let i = 0; i < recentHistory.length; i = i + 1) {
      const entry = recentHistory[i];
      if (entry.bodyFeel === 'energetic') avgEnergyScore = avgEnergyScore + 3;
      else if (entry.bodyFeel === 'normal') avgEnergyScore = avgEnergyScore + 2;
      else avgEnergyScore = avgEnergyScore + 1;
      
      if (entry.stress === 'calm') avgStressScore = avgStressScore + 3;
      else if (entry.stress === 'moderate') avgStressScore = avgStressScore + 2;
      else avgStressScore = avgStressScore + 1;
    }
    avgEnergyScore = Math.round((avgEnergyScore / recentHistory.length) * 33.33);
    avgStressScore = Math.round((avgStressScore / recentHistory.length) * 33.33);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      <div className="bg-white rounded-b-3xl shadow-sm p-6 mb-6">
        <button
          type="button"
          onClick={props.onBack}
          className="text-gray-600 mb-4"
        >
          {'<'} Back to Dashboard
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">{patient.name}</h1>
            <p className="text-gray-600">Patient ID: {patient.id}</p>
          </div>
          {patient.hasSymptoms ? (
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
              !
            </div>
          ) : null}
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className={riskClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Risk Profile</h2>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
              {riskIcon}
            </div>
          </div>
          <p className="text-2xl font-bold capitalize mb-3">{profile.riskLevel}</p>
          <p className="text-sm opacity-90">{riskMessage}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Metabolic Age</p>
            <p className="text-3xl font-bold text-blue-600">{profile.metabolicAge}</p>
            <p className="text-xs text-gray-500 mt-1">years</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Compliance</p>
            <p className="text-3xl font-bold text-purple-600">{compliancePercent}%</p>
            <p className="text-xs text-gray-500 mt-1">weekly</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h2 className="font-semibold mb-4">Health Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Energy Level</span>
                <span className="text-sm font-semibold">{avgEnergyScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: avgEnergyScore + '%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Stress Management</span>
                <span className="text-sm font-semibold">{avgStressScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all" 
                  style={{ width: avgStressScore + '%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h2 className="font-semibold mb-4">Profile Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Age Group</span>
              <span className="font-medium">{profile.ageGroup}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Height / Weight</span>
              <span className="font-medium">{profile.height} / {profile.weight}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Family History</span>
              <span className="font-medium capitalize">{profile.familyHistory}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Health Conditions</span>
              <span className="font-medium capitalize">{profile.healthConditions}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Movement Pattern</span>
              <span className="font-medium capitalize">{profile.movement}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Sleep Quality</span>
              <span className="font-medium capitalize">{profile.sleep}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Sugar Intake</span>
              <span className="font-medium capitalize">{profile.sugar}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h2 className="font-semibold mb-4">Recent Check-ins ({totalCheckIns} total)</h2>
          {recentHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No check-ins recorded yet</p>
          ) : (
            <div className="space-y-3">
              {recentHistory.reverse().map(function(entry, index) {
                let bodyFeelEmoji = '😊';
                if (entry.bodyFeel === 'energetic') bodyFeelEmoji = '💪';
                else if (entry.bodyFeel === 'tired') bodyFeelEmoji = '😴';

                let foodEmoji = '🍕';
                if (entry.food === 'balanced') foodEmoji = '🥗';
                else if (entry.food === 'sugary') foodEmoji = '🍭';

                return (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm font-medium text-gray-800 mb-2">{entry.date}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span>{bodyFeelEmoji}</span>
                        <span className="text-gray-600">Body: {entry.bodyFeel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{foodEmoji}</span>
                        <span className="text-gray-600">Food: {entry.food}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>😌</span>
                        <span className="text-gray-600">Stress: {entry.stress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>😴</span>
                        <span className="text-gray-600">Sleep: {entry.sleep}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {patient.hasSymptoms ? (
          <div className="bg-orange-50 border-2 border-orange-300 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">!</div>
              <h2 className="font-semibold text-orange-900">Symptom Alert</h2>
            </div>
            <p className="text-sm text-orange-800">
              Patient has reported symptoms requiring clinical attention. Review recent check-ins and consider outreach.
            </p>
          </div>
        ) : null}

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
          <h2 className="font-semibold mb-3">Clinical Recommendations</h2>
          <div className="space-y-2 text-sm">
            {profile.riskLevel === 'at-risk' ? (
              <>
                <p className="p-3 bg-white rounded-lg">
                  • Schedule follow-up consultation within 1 week
                </p>
                <p className="p-3 bg-white rounded-lg">
                  • Consider metabolic panel and HbA1c testing
                </p>
                <p className="p-3 bg-white rounded-lg">
                  • Increase check-in frequency to daily monitoring
                </p>
              </>
            ) : profile.riskLevel === 'watchful' ? (
              <>
                <p className="p-3 bg-white rounded-lg">
                  • Monitor trends over next 2-4 weeks
                </p>
                <p className="p-3 bg-white rounded-lg">
                  • Encourage consistent daily check-ins
                </p>
                <p className="p-3 bg-white rounded-lg">
                  • Focus on sleep quality and stress reduction
                </p>
              </>
            ) : (
              <>
                <p className="p-3 bg-white rounded-lg">
                  • Continue current monitoring schedule
                </p>
                <p className="p-3 bg-white rounded-lg">
                  • Reinforce healthy behavior patterns
                </p>
                <p className="p-3 bg-white rounded-lg">
                  • Quarterly metabolic assessment recommended
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}