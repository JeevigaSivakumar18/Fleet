import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiOutlineCog, HiOutlineUser, HiOutlineShieldCheck, HiOutlineBell } from 'react-icons/hi';

const Settings = () => {
    const { user } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState('5');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="animate-fade-in max-w-3xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <HiOutlineCog className="text-red-400" /> Settings
                </h1>
                <p className="text-gray-500 text-sm mt-1">Configure your application preferences</p>
            </div>

            {saved && (
                <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm animate-fade-in">
                    ✅ Settings saved successfully!
                </div>
            )}

            {/* Profile */}
            <div className="glass-card p-6 mb-5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <HiOutlineUser className="text-red-400" /> Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Username</label>
                        <input type="text" value={user?.username || ''} className="input-dark" readOnly />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Email</label>
                        <input type="email" value={user?.email || ''} className="input-dark" readOnly />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Role</label>
                        <input type="text" value={user?.role || ''} className="input-dark capitalize" readOnly />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Account Status</label>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            <span className="text-sm text-green-400">Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="glass-card p-6 mb-5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <HiOutlineBell className="text-red-400" /> Notifications
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div>
                            <p className="text-sm text-white">Enable Notifications</p>
                            <p className="text-xs text-gray-500">Receive alerts for maintenance & fuel</p>
                        </div>
                        <button onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                            className={`w-12 h-6 rounded-full transition-all duration-300 ${notificationsEnabled ? 'bg-red-600' : 'bg-gray-700'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* App Settings */}
            <div className="glass-card p-6 mb-5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <HiOutlineShieldCheck className="text-red-400" /> Application
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div>
                            <p className="text-sm text-white">Dark Mode</p>
                            <p className="text-xs text-gray-500">Use dark theme (recommended)</p>
                        </div>
                        <button onClick={() => setDarkMode(!darkMode)}
                            className={`w-12 h-6 rounded-full transition-all duration-300 ${darkMode ? 'bg-red-600' : 'bg-gray-700'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div>
                            <p className="text-sm text-white">Auto-Refresh Tracking</p>
                            <p className="text-xs text-gray-500">Automatically update live tracking data</p>
                        </div>
                        <button onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`w-12 h-6 rounded-full transition-all duration-300 ${autoRefresh ? 'bg-red-600' : 'bg-gray-700'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${autoRefresh ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                        </button>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5">
                        <label className="text-sm text-white mb-2 block">Refresh Interval (seconds)</label>
                        <select value={refreshInterval} onChange={(e) => setRefreshInterval(e.target.value)} className="input-dark">
                            <option value="3">3 seconds</option>
                            <option value="5">5 seconds</option>
                            <option value="10">10 seconds</option>
                            <option value="30">30 seconds</option>
                        </select>
                    </div>
                </div>
            </div>

            <button onClick={handleSave} className="btn-primary py-3 px-8">Save Settings</button>
        </div>
    );
};

export default Settings;
