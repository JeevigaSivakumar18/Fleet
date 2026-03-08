import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiOutlineBell, HiOutlineLogout, HiOutlineUser } from 'react-icons/hi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: 1, text: 'TRK-003 fuel level below 20%', type: 'warning', time: '2 min ago' },
        { id: 2, text: 'TRK-006 maintenance overdue', type: 'danger', time: '15 min ago' },
        { id: 3, text: 'New route optimized: Delhi → Mumbai', type: 'info', time: '1 hr ago' },
    ];

    return (
        <header className="fixed top-0 left-64 right-0 h-16 bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between px-6 z-40">
            <div>
                <h2 className="text-sm font-medium text-gray-400">Welcome back,</h2>
                <p className="text-base font-semibold text-white">{user?.username || 'Admin'}</p>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                    >
                        <HiOutlineBell className="text-lg text-gray-400" />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-12 w-80 glass-card p-2 animate-fade-in">
                            <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Notifications</p>
                            {notifications.map((n) => (
                                <div key={n.id} className="px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer transition-all">
                                    <p className="text-sm text-gray-300">{n.text}</p>
                                    <p className="text-xs text-gray-600 mt-1">{n.time}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* User */}
                <div className="flex items-center gap-3 pl-4 border-l border-[rgba(255,255,255,0.1)]">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                        <HiOutlineUser className="text-white text-sm" />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-white">{user?.username}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-all"
                    title="Logout"
                >
                    <HiOutlineLogout className="text-lg" />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
