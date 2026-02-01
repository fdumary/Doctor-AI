import { useState } from 'react';

export interface DoctorInfo {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  patients: number;
}

interface Props {
  onSelectDoctor: (doctor: DoctorInfo) => void;
  onBack: () => void;
}

export function DoctorSelection(props: Props) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  const availableDoctors: DoctorInfo[] = [
    {
      id: 'D001',
      name: 'Dr. Sarah Mitchell',
      specialty: 'Endocrinology',
      experience: '12 years',
      patients: 156,
    },
    {
      id: 'D002',
      name: 'Dr. James Chen',
      specialty: 'Internal Medicine',
      experience: '8 years',
      patients: 203,
    },
    {
      id: 'D003',
      name: 'Dr. Maria Rodriguez',
      specialty: 'Metabolic Health',
      experience: '15 years',
      patients: 134,
    },
    {
      id: 'D004',
      name: 'Dr. Robert Kim',
      specialty: 'Preventive Care',
      experience: '10 years',
      patients: 189,
    },
  ];

  const handleContinue = function() {
    const doctor = availableDoctors.find(function(d) {
      return d.id === selectedDoctorId;
    });
    if (doctor) {
      props.onSelectDoctor(doctor);
    }
  };

  const canContinue = selectedDoctorId !== null;
  const continueButtonClass = canContinue
    ? 'w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors'
    : 'w-full bg-gray-300 text-gray-500 p-4 rounded-xl font-semibold cursor-not-allowed';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
      <div className="p-6">
        <button
          type="button"
          onClick={props.onBack}
          className="text-gray-600 mb-4"
        >
          {'<'} Back
        </button>
        
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Select Your Doctor</h1>
          <p className="text-gray-600">Choose a doctor to monitor your health journey</p>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 space-y-4">
        <div className="space-y-3">
          {availableDoctors.map(function(doctor) {
            const isSelected = selectedDoctorId === doctor.id;
            const cardClass = isSelected
              ? 'w-full p-5 rounded-2xl border-2 border-blue-600 bg-blue-50 transition-all text-left'
              : 'w-full p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-blue-300 transition-all text-left';

            return (
              <button
                key={doctor.id}
                type="button"
                onClick={function() {
                  setSelectedDoctorId(doctor.id);
                }}
                className={cardClass}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    🩺
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg mb-1">{doctor.name}</p>
                    <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>{doctor.experience} exp</span>
                      <span>{doctor.patients} patients</span>
                    </div>
                  </div>
                  {isSelected ? (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0 text-sm">
                      ✔
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 mt-6">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Note:</span> Your selected doctor will have access to your health data and daily check-ins to provide personalized guidance.
          </p>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className={continueButtonClass}
        >
          Continue
        </button>
      </div>
    </div>
  );
}