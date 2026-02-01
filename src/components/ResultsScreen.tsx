import type { UserProfile } from '../App';

interface Props {
  profile: UserProfile;
  accountName: string;
  onContinue: () => void;
}

export function ResultsScreen(props: Props) {
  const profile = props.profile;
  
  let riskColorClass = 'text-green-600 bg-green-50 border-green-200';
  let riskIcon = '✔';
  let riskMessage = 'You\'re in a good place metabolically. Keep building on your healthy patterns.';
  
  if (profile.riskLevel === 'watchful') {
    riskColorClass = 'text-yellow-600 bg-yellow-50 border-yellow-200';
    riskIcon = '⚡';
    riskMessage = 'Your body is giving early signals. Small changes now can make a big difference.';
  } else if (profile.riskLevel === 'at-risk') {
    riskColorClass = 'text-red-600 bg-red-50 border-red-200';
    riskIcon = '!';
    riskMessage = 'Your metabolic health needs attention. We\'ll guide you with personalized daily actions.';
  }

  const riskClass = 'p-6 rounded-2xl border-2 ' + riskColorClass;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">+</div>
          <span className="font-semibold text-lg">Doctor AI</span>
        </div>
        
        <h1 className="text-2xl font-semibold mb-2">Your Results, {props.accountName}</h1>
        <p className="text-gray-600">Here's what we learned about your metabolic health</p>
      </div>

      <div className="flex-1 px-6 pb-6 space-y-6">
        <div className={riskClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Metabolic Risk Profile</h2>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
              {riskIcon}
            </div>
          </div>
          <p className="text-2xl font-bold capitalize mb-3">{profile.riskLevel}</p>
          <p className="text-sm opacity-90">{riskMessage}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="font-semibold mb-4">Your Metabolic Age</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-blue-600">{profile.metabolicAge}</p>
            <p className="text-gray-600">years</p>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This is based on your lifestyle patterns and health markers
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-2xl">
          <h3 className="font-semibold mb-3">What This Means</h3>
          <div className="space-y-2 text-sm">
            <p className="p-3 bg-white rounded-lg">
              • Daily 60-second check-ins help us spot patterns early
            </p>
            <p className="p-3 bg-white rounded-lg">
              • Your body signals guide personalized recommendations
            </p>
            <p className="p-3 bg-white rounded-lg">
              • Small, consistent actions create lasting metabolic change
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200">
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-semibold">Ready to start?</span>
          </p>
          <p className="text-sm text-gray-600">
            Your personalized dashboard is waiting
          </p>
        </div>

        <button
          type="button"
          onClick={props.onContinue}
          className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}