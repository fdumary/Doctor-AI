import { useState } from 'react';
import { RoleSelection } from './components/RoleSelection';
import { CreateAccount, type AccountData } from './components/CreateAccount';
import { Login } from './components/Login';
import { Settings } from './components/Settings';
import { DoctorSelection, type DoctorInfo } from './components/DoctorSelection';
import { Onboarding } from './components/Onboarding';
import { ResultsScreen } from './components/ResultsScreen';
import { Dashboard } from './components/Dashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientDetailView } from './components/PatientDetailView';
import { DailyCheckIn } from './components/DailyCheckIn';
import { WeeklyCheck } from './components/WeeklyCheck';
import { WatchDashboard } from './components/WatchDashboard';
import { WatchDailyCheckIn } from './components/WatchDailyCheckIn';

export type UserProfile = {
  lifestyle: string;
  ageGroup: string;
  height: string;
  weight: string;
  familyHistory: string;
  healthConditions: string;
  waistWeight: string;
  movement: string;
  sleep: string;
  sugar: string;
  riskLevel: 'stable' | 'watchful' | 'at-risk';
  metabolicAge: number;
};

export type DailyData = {
  bodyFeel: string;
  movement: string;
  food: string;
  stress: string;
  sleep: string;
  date: string;
};

export type PatientRecord = {
  id: string;
  name: string;
  profile: UserProfile;
  dailyHistory: DailyData[];
  lastCheckIn: string;
  hasSymptoms: boolean;
};

type Screen = 'role-select' | 'create-account' | 'login' | 'settings' | 'doctor-selection' | 'onboarding' | 'results' | 'dashboard' | 'daily' | 'weekly' | 'doctor-dashboard' | 'patient-detail';
type DeviceLayout = 'phone' | 'watch';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('role-select');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | null>(null);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyHistory, setDailyHistory] = useState<DailyData[]>([]);
  const [deviceLayout, setDeviceLayout] = useState<DeviceLayout>('phone');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const mockPatients: PatientRecord[] = [
    {
      id: 'P001',
      name: 'Sarah Johnson',
      profile: {
        lifestyle: 'active-inconsistent',
        ageGroup: '45-59',
        height: '165cm',
        weight: '72kg',
        familyHistory: 'yes',
        healthConditions: 'one',
        waistWeight: 'yes',
        movement: 'walking',
        sleep: 'okay',
        sugar: 'occasional',
        riskLevel: 'watchful',
        metabolicAge: 52,
      },
      dailyHistory: [
        { bodyFeel: 'normal', movement: 'some', food: 'mixed', stress: 'moderate', sleep: 'okay', date: 'Jan 30 2026' },
        { bodyFeel: 'tired', movement: 'barely', food: 'sugary', stress: 'high', sleep: 'poor', date: 'Jan 29 2026' },
      ],
      lastCheckIn: '1 day ago',
      hasSymptoms: false,
    },
    {
      id: 'P002',
      name: 'Michael Chen',
      profile: {
        lifestyle: 'sitting',
        ageGroup: '30-44',
        height: '178cm',
        weight: '95kg',
        familyHistory: 'yes',
        healthConditions: 'more-than-one',
        waistWeight: 'yes',
        movement: 'sitting',
        sleep: 'exhausting',
        sugar: 'daily',
        riskLevel: 'at-risk',
        metabolicAge: 45,
      },
      dailyHistory: [
        { bodyFeel: 'tired', movement: 'barely', food: 'sugary', stress: 'high', sleep: 'poor', date: 'Jan 28 2026' },
      ],
      lastCheckIn: '3 days ago',
      hasSymptoms: true,
    },
    {
      id: 'P003',
      name: 'Emma Rodriguez',
      profile: {
        lifestyle: 'active-inconsistent',
        ageGroup: '30-44',
        height: '160cm',
        weight: '58kg',
        familyHistory: 'no',
        healthConditions: 'none',
        waistWeight: 'no',
        movement: 'active',
        sleep: 'restful',
        sugar: 'rare',
        riskLevel: 'stable',
        metabolicAge: 32,
      },
      dailyHistory: [
        { bodyFeel: 'energetic', movement: 'enough', food: 'balanced', stress: 'calm', sleep: 'good', date: 'Jan 31 2026' },
        { bodyFeel: 'energetic', movement: 'enough', food: 'balanced', stress: 'calm', sleep: 'good', date: 'Jan 30 2026' },
        { bodyFeel: 'normal', movement: 'some', food: 'balanced', stress: 'calm', sleep: 'good', date: 'Jan 29 2026' },
      ],
      lastCheckIn: 'Today',
      hasSymptoms: false,
    },
  ];

  const handleRoleSelect = function(role: 'patient' | 'doctor') {
    setSelectedRole(role);
    setCurrentScreen('create-account');
  };

  const handleAccountComplete = function(data: AccountData) {
    setAccountData(data);
    if (data.role === 'patient') {
      setCurrentScreen('doctor-selection');
    } else {
      setCurrentScreen('doctor-dashboard');
    }
  };

  const handleDoctorSelectionComplete = function(doctor: DoctorInfo) {
    console.log('Selected doctor:', doctor);
    setCurrentScreen('onboarding');
  };

  const handleBackToAccount = function() {
    setCurrentScreen('create-account');
  };

  const handleOnboardingComplete = function(profile: UserProfile) {
    setUserProfile(profile);
    setCurrentScreen('results');
  };

  const handleResultsContinue = function() {
    setCurrentScreen('dashboard');
  };

  const handleDailyCheckInComplete = function(data: DailyData) {
    setDailyHistory([...dailyHistory, data]);
    setCurrentScreen('dashboard');
  };

  const handleSwitchToDoctor = function() {
    setCurrentScreen('doctor-dashboard');
  };

  const handleSwitchToPatient = function() {
    if (userProfile) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('onboarding');
    }
  };

  const handleViewPatient = function(patientId: string) {
    console.log('Viewing patient:', patientId);
    setSelectedPatientId(patientId);
    setCurrentScreen('patient-detail');
  };

  const handleStartDaily = function() {
    setCurrentScreen('daily');
  };

  const handleStartWeekly = function() {
    setCurrentScreen('weekly');
  };

  const handleBackToDashboard = function() {
    setCurrentScreen('dashboard');
  };

  const handleBackToDoctorDashboard = function() {
    setCurrentScreen('doctor-dashboard');
  };

  const handleBackToRoleSelect = function() {
    setCurrentScreen('role-select');
    setSelectedRole(null);
    setAccountData(null);
  };

  const handleSwitchToLogin = function() {
    setCurrentScreen('login');
  };

  const handleSwitchToSignUp = function() {
    setCurrentScreen('create-account');
  };

  const handleOpenSettings = function() {
    setCurrentScreen('settings');
  };

  const handleLogout = function() {
    setCurrentScreen('role-select');
    setSelectedRole(null);
    setAccountData(null);
    setUserProfile(null);
    setDailyHistory([]);
  };

  const handleSwitchLayout = function() {
    if (deviceLayout === 'phone') {
      setDeviceLayout('watch');
    } else {
      setDeviceLayout('phone');
    }
  };

  let phoneContent = null;
  let watchContent = null;

  if (currentScreen === 'role-select') {
    phoneContent = <RoleSelection onSelectRole={handleRoleSelect} />;
  } else if (currentScreen === 'create-account' && selectedRole) {
    phoneContent = (
      <CreateAccount 
        role={selectedRole}
        onComplete={handleAccountComplete}
        onBack={handleBackToRoleSelect}
        onSwitchToLogin={handleSwitchToLogin}
      />
    );
  } else if (currentScreen === 'login') {
    phoneContent = (
      <Login
        onComplete={handleAccountComplete}
        onBack={handleBackToRoleSelect}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
    );
  } else if (currentScreen === 'settings' && accountData) {
    phoneContent = (
      <Settings
        onBack={accountData.role === 'patient' ? handleBackToDashboard : handleBackToDoctorDashboard}
        onLogout={handleLogout}
        userId={accountData.userId}
      />
    );
  } else if (currentScreen === 'doctor-selection') {
    phoneContent = (
      <DoctorSelection 
        onSelectDoctor={handleDoctorSelectionComplete}
        onBack={handleBackToAccount}
      />
    );
  } else if (currentScreen === 'onboarding') {
    phoneContent = <Onboarding onComplete={handleOnboardingComplete} />;
  } else if (currentScreen === 'results' && userProfile && accountData) {
    phoneContent = (
      <ResultsScreen 
        profile={userProfile}
        accountName={accountData.name}
        onContinue={handleResultsContinue}
      />
    );
  } else if (currentScreen === 'dashboard' && userProfile) {
    phoneContent = (
      <Dashboard 
        profile={userProfile}
        dailyHistory={dailyHistory}
        onStartDailyCheckIn={handleStartDaily}
        onStartWeeklyCheck={handleStartWeekly}
        onSwitchToDoctor={handleSwitchToDoctor}
        onOpenSettings={handleOpenSettings}
      />
    );
    watchContent = (
      <WatchDashboard 
        profile={userProfile}
        onStartCheckIn={handleStartDaily}
      />
    );
  } else if (currentScreen === 'daily') {
    phoneContent = (
      <DailyCheckIn 
        onComplete={handleDailyCheckInComplete}
        onBack={handleBackToDashboard}
      />
    );
    watchContent = <WatchDailyCheckIn onComplete={handleDailyCheckInComplete} />;
  } else if (currentScreen === 'weekly') {
    phoneContent = (
      <WeeklyCheck 
        onComplete={handleBackToDashboard}
        onBack={handleBackToDashboard}
      />
    );
  } else if (currentScreen === 'doctor-dashboard') {
    phoneContent = (
      <DoctorDashboard 
        onSwitchToPatient={handleSwitchToPatient}
        patients={mockPatients}
        onViewPatient={handleViewPatient}
      />
    );
  } else if (currentScreen === 'patient-detail' && selectedPatientId) {
    const patient = mockPatients.find(p => p.id === selectedPatientId);
    if (patient) {
      phoneContent = (
        <PatientDetailView 
          patient={patient}
          onBack={handleBackToDoctorDashboard}
        />
      );
    }
  }

  const phoneClass = 'mx-auto bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-900';
  const phoneStyle = { width: '375px', height: '812px' };
  
  const watchClass = 'mx-auto bg-black rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-gray-800';
  const watchStyle = { width: '184px', height: '224px' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSwitchLayout}
            className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all text-sm font-medium"
          >
            Switch to {deviceLayout === 'phone' ? 'Watch' : 'Phone'}
          </button>
          <div className="text-sm text-gray-600">
            Current: {deviceLayout === 'phone' ? '📱 iPhone' : '⌚ Apple Watch'}
          </div>
        </div>

        <div className="flex gap-8 items-start">
          <div>
            <p className="text-center text-xs text-gray-500 mb-3">iPhone Layout</p>
            <div className={phoneClass} style={phoneStyle}>
              <div className="w-full h-full overflow-y-auto bg-white">
                {phoneContent}
              </div>
            </div>
          </div>

          {watchContent ? (
            <div>
              <p className="text-center text-xs text-gray-500 mb-3">Apple Watch Layout</p>
              <div className={watchClass} style={watchStyle}>
                {watchContent}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;