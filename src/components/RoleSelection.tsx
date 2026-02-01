interface Props {
  onSelectRole: (role: 'patient' | 'doctor') => void;
}

export function RoleSelection(props: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-3xl font-bold">+</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Doctor AI</h1>
        <p className="text-gray-600">Personalized metabolic health insights</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button
          type="button"
          onClick={function() { props.onSelectRole('patient'); }}
          className="w-full p-6 bg-white rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all text-left shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <p className="font-semibold text-lg">I'm a Patient</p>
              <p className="text-sm text-gray-600">Track my health journey</p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={function() { props.onSelectRole('doctor'); }}
          className="w-full p-6 bg-white rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition-all text-left shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
              🩺
            </div>
            <div>
              <p className="font-semibold text-lg">I'm a Doctor</p>
              <p className="text-sm text-gray-600">Monitor my patients</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}