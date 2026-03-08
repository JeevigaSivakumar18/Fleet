import { NavLink } from 'react-router-dom';
import { HiOutlineViewGrid, HiOutlineLocationMarker, HiOutlineTruck, HiOutlineMap, HiOutlineKey, HiOutlineChartBar, HiOutlineCog } from 'react-icons/hi';

const navItems = [
    { path: '/', icon: HiOutlineViewGrid, label: 'Overview' },
    { path: '/live-tracking', icon: HiOutlineLocationMarker, label: 'Live Tracking' },
    { path: '/fleet', icon: HiOutlineTruck, label: 'Fleet Management' },
    { path: '/route-planner', icon: HiOutlineMap, label: 'Route Planner' },
    { path: '/maintenance', icon: HiOutlineKey, label: 'Maintenance' },
    { path: '/analytics', icon: HiOutlineChartBar, label: 'Data Analytics' },
    { path: '/settings', icon: HiOutlineCog, label: 'Settings' },
];

const Sidebar = () => {
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0d0d0d] border-r border-[rgba(255,255,255,0.06)] flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                        <HiOutlineTruck className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold gradient-text">FleetX</h1>
                        <p className="text-[11px] text-gray-500">Logistics Platform</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto">
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-red-600/20 to-transparent text-red-400 border-l-2 border-red-500'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                }`
                            }
                        >
                            <item.icon className="text-lg flex-shrink-0" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Bottom */}
            <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
                <div className="glass-card p-3 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">System Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs text-green-400">All systems operational</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
