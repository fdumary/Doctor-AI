import type { UserProfile, DailyData } from '../App';
import { Settings } from 'lucide-react';

interface Props {
  profile: UserProfile;
  dailyHistory: DailyData[];
  onStartDailyCheckIn: () => void;
  onStartWeeklyCheck: () => void;
  onSwitchToDoctor: () => void;
  onOpenSettings?: () => void;
}

export function Dashboard(props: Props) {
  const profile = props.profile;
  const dailyHistory = props.dailyHistory;
  
  let riskColorClass = 'text-green-600 bg-green-50 border-green-200';
  let riskIcon = 'Stable';
  
  if (profile.riskLevel === 'watchful') {
    riskColorClass = 'text-yellow-600 bg-yellow-50 border-yellow-200';
    riskIcon = 'Watch';
  } else if (profile.riskLevel === 'at-risk') {
    riskColorClass = 'text-red-600 bg-red-50 border-red-200';
    riskIcon = 'Risk';
  }

  let badgeLabel = 'Stabilizer';
  if (dailyHistory.length >= 14) {
    badgeLabel = 'Momentum Maker';
  } else if (dailyHistory.length >= 7) {
    badgeLabel = 'Rebuilder';
  }

  const streakDays = dailyHistory.length;
  const todayDate = new Date().toDateString();
  let todayCheckedIn = false;
  for (let i = 0; i < dailyHistory.length; i = i + 1) {
    const entry = dailyHistory[i];
    if (entry && entry.date === todayDate) {
      todayCheckedIn = true;
      break;
    }
  }
  
  const showTrends = dailyHistory.length >= 3;
  const showPrediction = dailyHistory.length >= 14 && profile.riskLevel !== 'stable';
  const dayText = streakDays === 1 ? 'day' : 'days';
  const riskClass = 'p-6 rounded-2xl border-2 ' + riskColorClass;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      <div className="bg-white rounded-b-3xl shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-gray-600">Check in on your progress</p>
      </div>

      <div className="px-6 space-y-6">
        <div className={riskClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Your Metabolic Risk Profile</h2>
            <div className="px-3 py-1 rounded-full bg-white font-bold text-sm">{riskIcon}</div>
          </div>
          <p className="text-2xl font-bold capitalize mb-2">{profile.riskLevel}</p>
          <p className="text-sm opacity-80">
            Metabolic Age: <span className="font-semibold">{profile.metabolicAge} years</span>
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-2xl">
          <div className="mb-3">
            <p className="text-sm text-gray-600">You are a</p>
            <p className="text-xl font-semibold">{badgeLabel}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-5 h-5 bg-yellow-400 rounded-full"></div>
            <span>{streakDays} {dayText} logged</span>
          </div>
        </div>

        {todayCheckedIn ? (
          <div className="bg-green-50 border-2 border-green-200 p-6 rounded-2xl">
            <p className="font-semibold text-green-700">Check-in complete</p>
            <p className="text-sm text-green-600">See you tomorrow</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={props.onStartDailyCheckIn}
            className="w-full bg-blue-600 text-white p-6 rounded-2xl hover:bg-blue-700 transition-colors text-left"
          >
            <p className="font-semibold text-lg mb-1">Daily Check-In</p>
            <p className="text-sm text-blue-100">Just 60 seconds - Tap to start</p>
          </button>
        )}

        <button
          type="button"
          onClick={props.onStartWeeklyCheck}
          className="w-full bg-white border-2 border-purple-200 p-6 rounded-2xl hover:border-purple-400 transition-colors text-left"
        >
          <p className="font-semibold mb-1">Weekly Body Signal Check</p>
          <p className="text-sm text-gray-600">Optional - 30 seconds</p>
        </button>

        {showTrends ? (
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <h3 className="font-semibold mb-4">Your Trends</h3>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm">
                  Over the past 7 days, your body handled sugar better on high-step days.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm">
                  Your sleep helped offset lower movement this week. Two small wins beat one perfect day.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="font-semibold mb-4">Your 2 Goals This Week</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold">1</div>
              <p className="flex-1 text-sm">Take a 10-minute walk after lunch</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold">2</div>
              <p className="flex-1 text-sm">Swap one sugary snack for fruit</p>
            </div>
          </div>
        </div>

        {showPrediction ? (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border-2 border-orange-200">
            <p className="font-semibold mb-2">Predictive Insight</p>
            <p className="text-sm text-gray-700">
              If your current pattern continues, your metabolic risk may increase in 3-4 weeks. 
              Small changes now can shift this trend.
            </p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={props.onSwitchToDoctor}
          className="w-full bg-white border-2 border-purple-200 p-6 rounded-2xl hover:border-purple-400 transition-colors text-left"
        >
          <p className="font-semibold mb-1">Consult a Doctor</p>
          <p className="text-sm text-gray-600">Get professional advice</p>
        </button>

        {props.onOpenSettings ? (
          <button
            type="button"
            onClick={props.onOpenSettings}
            className="w-full bg-white border-2 border-gray-200 p-6 rounded-2xl hover:border-gray-400 transition-colors flex items-center justify-between"
          >
            <div className="text-left">
              <p className="font-semibold mb-1">Settings</p>
              <p className="text-sm text-gray-600">Manage your account & accessibility</p>
            </div>
            <Settings className="w-5 h-5 text-gray-500" />
          </button>
        ) : null}
      </div>
    </div>
  );
}