import type { UserProfile } from '../App';

interface Props {
  profile: UserProfile;
  onStartCheckIn: () => void;
}

export function WatchDashboard(props: Props) {
  const profile = props.profile;
  
  let riskColor = 'text-green-400';
  let riskEmoji = '✔';
  
  if (profile.riskLevel === 'watchful') {
    riskColor = 'text-yellow-400';
    riskEmoji = '⚡';
  } else if (profile.riskLevel === 'at-risk') {
    riskColor = 'text-red-400';
    riskEmoji = '!';
  }

  return (
    <div className="h-full bg-black flex flex-col p-3">
      <div className="flex-1 flex flex-col items-center justify-center space-y-3">
        <div className="text-center">
          <div className={'text-4xl mb-2 ' + riskColor}>
            {riskEmoji}
          </div>
          <p className="text-white text-xs font-semibold capitalize">
            {profile.riskLevel}
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-3 w-full text-center">
          <p className="text-gray-400 text-xs mb-1">Metabolic Age</p>
          <p className="text-white text-2xl font-bold">{profile.metabolicAge}</p>
        </div>

        <button
          type="button"
          onClick={props.onStartCheckIn}
          className="w-full bg-green-600 text-white py-3 rounded-full text-xs font-semibold hover:bg-green-700 transition-colors"
        >
          Check In
        </button>
      </div>

      <div className="text-center">
        <p className="text-gray-500 text-xs">Doctor AI</p>
      </div>
    </div>
  );
}