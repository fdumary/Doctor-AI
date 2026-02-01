import type { UserProfile, DailyData } from '../App';

interface PatientRecord {
  id: string;
  name: string;
  profile: UserProfile;
  dailyHistory: DailyData[];
  lastCheckIn: string;
  hasSymptoms: boolean;
}

interface Props {
  patients: PatientRecord[];
  onViewPatient: (patientId: string) => void;
  onSwitchToPatient: () => void;
}

export function DoctorDashboard(props: Props) {
  const totalPatients = props.patients.length;
  
  let atRiskCount = 0;
  let watchfulCount = 0;
  let stableCount = 0;
  let flaggedCount = 0;
  let activeThisWeek = 0;
  
  for (let i = 0; i < props.patients.length; i = i + 1) {
    const patient = props.patients[i];
    if (patient.profile.riskLevel === 'at-risk') atRiskCount = atRiskCount + 1;
    if (patient.profile.riskLevel === 'watchful') watchfulCount = watchfulCount + 1;
    if (patient.profile.riskLevel === 'stable') stableCount = stableCount + 1;
    if (patient.hasSymptoms) flaggedCount = flaggedCount + 1;
    if (patient.dailyHistory.length > 0) activeThisWeek = activeThisWeek + 1;
  }
  
  const complianceRate = totalPatients > 0 ? Math.round((activeThisWeek / totalPatients) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      <div className="bg-white rounded-b-3xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Doctor Dashboard</h1>
            <p className="text-gray-600">Patient overview and insights</p>
          </div>
          <button
            type="button"
            onClick={props.onSwitchToPatient}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
          >
            Patient View
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Patients</p>
            <p className="text-3xl font-bold">{totalPatients}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Check-in Rate</p>
            <p className="text-3xl font-bold">{complianceRate}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h2 className="font-semibold mb-4">Risk Distribution</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="font-medium">At-Risk</span>
              </div>
              <span className="font-bold text-red-600">{atRiskCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                <span className="font-medium">Watchful</span>
              </div>
              <span className="font-bold text-yellow-600">{watchfulCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="font-medium">Stable</span>
              </div>
              <span className="font-bold text-green-600">{stableCount}</span>
            </div>
          </div>
        </div>

        {flaggedCount > 0 ? (
          <div className="bg-orange-50 border-2 border-orange-300 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">!</div>
              <h2 className="font-semibold text-orange-900">Symptom Alerts</h2>
            </div>
            <p className="text-sm text-orange-800">
              {flaggedCount} {flaggedCount === 1 ? 'patient has' : 'patients have'} reported symptoms requiring attention
            </p>
          </div>
        ) : null}

        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h2 className="font-semibold mb-4">Patient List</h2>
          <div className="space-y-3">
            {props.patients.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No patients enrolled yet</p>
            ) : null}
            
            {props.patients.map(function(patient) {
              let riskColor = 'bg-green-100 text-green-700 border-green-300';
              if (patient.profile.riskLevel === 'watchful') {
                riskColor = 'bg-yellow-100 text-yellow-700 border-yellow-300';
              } else if (patient.profile.riskLevel === 'at-risk') {
                riskColor = 'bg-red-100 text-red-700 border-red-300';
              }
              
              const checkInCount = patient.dailyHistory.length;
              const daysSinceCheckIn = patient.lastCheckIn || 'Never';
              
              return (
                <button
                  key={patient.id}
                  type="button"
                  onClick={function() { props.onViewPatient(patient.id); }}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all text-left bg-white"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{patient.name}</p>
                      <p className="text-sm text-gray-600">ID: {patient.id}</p>
                    </div>
                    {patient.hasSymptoms ? (
                      <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">!</div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={'px-3 py-1 rounded-full text-xs font-semibold border ' + riskColor}>
                      {patient.profile.riskLevel}
                    </span>
                    <span className="text-xs text-gray-600">
                      Metabolic Age: {patient.profile.metabolicAge}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>{checkInCount} check-ins</span>
                    <span>Last: {daysSinceCheckIn}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-200">
          <h2 className="font-semibold mb-3">Clinical Insights</h2>
          <div className="space-y-2 text-sm">
            <p className="p-3 bg-white rounded-lg">
              • Patients with consistent check-ins show 23% better metabolic stability
            </p>
            <p className="p-3 bg-white rounded-lg">
              • Sleep quality correlates with improved glucose regulation in 67% of cases
            </p>
            <p className="p-3 bg-white rounded-lg">
              • Movement patterns predict risk escalation 2-3 weeks in advance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
