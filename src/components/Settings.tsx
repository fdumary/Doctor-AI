import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { Settings as SettingsIcon, Lock, Shield, Accessibility, LogOut } from 'lucide-react';

interface Props {
  onBack: () => void;
  onLogout: () => void;
  userId: string;
}

export function Settings(props: Props) {
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'accessibility'>('account');
  
  // Account settings
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // 2FA
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  
  // Accessibility
  const [fontSize, setFontSize] = useState('medium');
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(function() {
    loadUserData();
    loadAccessibilitySettings();
  }, []);

  const loadUserData = async function() {
    try {
      const { data } = await supabase.auth.getUser();
      
      if (data.user) {
        setEmail(data.user.email || '');
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const loadAccessibilitySettings = function() {
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    const savedZoom = localStorage.getItem('zoomLevel') || '100';
    setFontSize(savedFontSize);
    setZoomLevel(parseInt(savedZoom));
  };

  const handleUpdateEmail = async function() {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (updateError) {
        console.error('Supabase updateUser (email) error:', updateError);
        setError(updateError.message);
      } else {
        setMessage('Confirmation email sent to your new address. Please check your inbox.');
        setNewEmail('');
      }
    } catch (err) {
      console.error('Error updating email:', err);
      setError('Failed to update email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async function() {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error('Supabase updateUser (password) error:', updateError);
        setError(updateError.message);
      } else {
        setMessage('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async function() {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data, error: mfaError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });

      if (mfaError) {
        console.error('Supabase MFA enroll error:', mfaError);
        setError(mfaError.message);
      } else if (data) {
        setQrCode(data.totp.qr_code);
        setTwoFactorEnabled(true);
        setMessage('Scan this QR code with your authenticator app');
      }
    } catch (err) {
      console.error('Error enabling 2FA:', err);
      setError('Failed to enable 2FA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFontSizeChange = function(size: string) {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    document.documentElement.style.fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
    setMessage('Font size updated');
    setTimeout(function() { setMessage(''); }, 2000);
  };

  const handleZoomChange = function(zoom: number) {
    setZoomLevel(zoom);
    localStorage.setItem('zoomLevel', zoom.toString());
    document.body.style.zoom = `${zoom}%`;
    setMessage('Zoom level updated');
    setTimeout(function() { setMessage(''); }, 2000);
  };

  const handleLogout = async function() {
    await supabase.auth.signOut();
    props.onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
      <div className="p-6">
        <button
          type="button"
          onClick={props.onBack}
          className="text-gray-600 mb-4"
        >
          {'<'} Back to Dashboard
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-gray-600">Manage your account</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={function() { setActiveTab('account'); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'account' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Account
          </button>
          <button
            type="button"
            onClick={function() { setActiveTab('security'); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'security' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Security
          </button>
          <button
            type="button"
            onClick={function() { setActiveTab('accessibility'); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'accessibility' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Access
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 space-y-4">
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Current Email
              </h3>
              <p className="text-sm text-gray-600 mb-4">{email}</p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={function(e) { setNewEmail(e.target.value); }}
                placeholder="Enter new email"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none mb-3"
              />
              
              <button
                type="button"
                onClick={handleUpdateEmail}
                disabled={!newEmail || loading}
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Email'}
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-red-50 text-red-600 p-4 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Change Password
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={function(e) { setNewPassword(e.target.value); }}
                    placeholder="At least 8 characters"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={function(e) { setConfirmPassword(e.target.value); }}
                    placeholder="Re-enter password"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleUpdatePassword}
                  disabled={!newPassword || !confirmPassword || loading}
                  className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Two-Factor Authentication
              </h3>
              
              {!twoFactorEnabled ? (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <button
                    type="button"
                    onClick={handleEnable2FA}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                  >
                    {loading ? 'Setting up...' : 'Enable 2FA'}
                  </button>
                </div>
              ) : (
                <div>
                  {qrCode && (
                    <div className="mb-4">
                      <img src={qrCode} alt="QR Code" className="mx-auto" />
                      <p className="text-sm text-gray-600 text-center mt-2">
                        Scan with Google Authenticator or Authy
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Two-factor authentication is enabled</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Accessibility Tab */}
        {activeTab === 'accessibility' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Accessibility className="w-4 h-4" />
                Font Size
              </h3>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={function() { handleFontSizeChange('small'); }}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    fontSize === 'small'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xs">A</div>
                  <div className="text-xs mt-1">Small</div>
                </button>
                
                <button
                  type="button"
                  onClick={function() { handleFontSizeChange('medium'); }}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    fontSize === 'medium'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm">A</div>
                  <div className="text-xs mt-1">Medium</div>
                </button>
                
                <button
                  type="button"
                  onClick={function() { handleFontSizeChange('large'); }}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    fontSize === 'large'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-base">A</div>
                  <div className="text-xs mt-1">Large</div>
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Accessibility className="w-4 h-4" />
                Display Zoom
              </h3>
              
              <div className="space-y-3">
                <input
                  type="range"
                  min="80"
                  max="150"
                  step="10"
                  value={zoomLevel}
                  onChange={function(e) { handleZoomChange(parseInt(e.target.value)); }}
                  className="w-full"
                />
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>80%</span>
                  <span className="font-semibold text-blue-600">{zoomLevel}%</span>
                  <span>150%</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Accessibility Tips:</span> You can also use your browser's zoom function (Ctrl/Cmd + or -) for additional control.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}