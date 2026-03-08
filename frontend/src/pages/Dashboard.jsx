import { useState, useEffect } from 'react';
import { analyticsAPI, trucksAPI, routesAPI } from '../services/api';
import {
    HiOutlineTruck, HiOutlineMap, HiOutlineExclamation, HiOutlineLightningBolt,
    HiOutlineArrowRight, HiOutlineFire, HiOutlineCheckCircle,
} from 'react-icons/hi';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalTrucks: 0, activeTrucks: 0, totalRoutes: 0, maintenanceAlerts: 0 });
    const [trucks, setTrucks] = useState([]);
    const [recentRoutes, setRecentRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [statsRes, trucksRes, routesRes] = await Promise.all([
                analyticsAPI.getDashboardStats(),
                trucksAPI.getAll(),
                routesAPI.getAll(),
            ]);
            setStats(statsRes.data);
            setTrucks(trucksRes.data);
            setRecentRoutes(routesRes.data.slice(0, 5));
        } catch (err) {
            console.error('Failed to fetch dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { key: 'totalTrucks', label: 'Total Trucks', icon: HiOutlineTruck, color: 'from-red-600 to-red-800', bg: 'bg-red-500/10' },
        { key: 'activeTrucks', label: 'Active Trucks', icon: HiOutlineLightningBolt, color: 'from-green-600 to-green-800', bg: 'bg-green-500/10' },
        { key: 'totalRoutes', label: 'Total Routes', icon: HiOutlineMap, color: 'from-blue-600 to-blue-800', bg: 'bg-blue-500/10' },
        { key: 'maintenanceAlerts', label: 'Maintenance Alerts', icon: HiOutlineExclamation, color: 'from-yellow-600 to-yellow-800', bg: 'bg-yellow-500/10' },
    ];

    const lowFuelTrucks = trucks.filter(t => t.fuelLevel < 30);
    const maintenanceTrucks = trucks.filter(t => t.status === 'maintenance');

    // Fake sparkline data for each stat card
    const sparkData = [
        [40, 45, 42, 50, 55, 52, stats.totalTrucks],
        [20, 22, 25, 23, 28, 26, stats.activeTrucks],
        [5, 8, 7, 10, 12, 15, stats.totalRoutes],
        [1, 2, 1, 3, 2, 4, stats.maintenanceAlerts],
    ];

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-gray-500 text-sm mt-1">Monitor your fleet performance in real-time</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                {statCards.map((card, i) => (
                    <div key={card.key} className="glass-card glass-card-hover p-6 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                                <card.icon className="text-white text-xl" />
                            </div>
                            <span className="text-3xl font-bold text-white">
                                {loading ? (
                                    <span className="w-10 h-8 bg-white/10 rounded animate-pulse inline-block" />
                                ) : stats[card.key]}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{card.label}</p>
                        <div className="h-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sparkData[i].map((v, j) => ({ v }))}>
                                    <Area type="monotone" dataKey="v" stroke="rgba(255,255,255,0.3)" fill="rgba(255,255,255,0.05)" strokeWidth={1.5} dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                {/* Fleet Status */}
                <div className="glass-card p-6">
                    <h3 className="text-base font-semibold text-white mb-4">Fleet Status</h3>
                    <div className="space-y-2">
                        {[
                            { label: 'Active & Running', value: trucks.filter(t => t.engineStatus === 'running').length, dot: 'bg-green-500', color: 'text-green-400' },
                            { label: 'Idle', value: trucks.filter(t => t.engineStatus === 'idle').length, dot: 'bg-yellow-500', color: 'text-yellow-400' },
                            { label: 'In Maintenance', value: maintenanceTrucks.length, dot: 'bg-orange-500', color: 'text-orange-400' },
                            { label: 'Engine Off', value: trucks.filter(t => t.engineStatus === 'off').length, dot: 'bg-red-500', color: 'text-red-400' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${item.dot}`}></div>
                                    <span className="text-sm text-gray-300">{item.label}</span>
                                </div>
                                <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                            <span>Fleet Utilization</span>
                            <span>{trucks.length > 0 ? Math.round((trucks.filter(t => t.status === 'active').length / trucks.length) * 100) : 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full">
                            <div
                                className="h-2 bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-1000"
                                style={{ width: `${trucks.length > 0 ? Math.round((trucks.filter(t => t.status === 'active').length / trucks.length) * 100) : 0}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Low Fuel Alerts */}
                <div className="glass-card p-6">
                    <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                        <HiOutlineFire className="text-orange-400" /> Fuel Alerts
                    </h3>
                    {lowFuelTrucks.length === 0 ? (
                        <div className="text-center py-6">
                            <HiOutlineCheckCircle className="text-green-400 text-3xl mx-auto mb-2" />
                            <p className="text-sm text-green-400">All trucks have sufficient fuel</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {lowFuelTrucks.map(truck => (
                                <div key={truck._id} className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/15">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-semibold text-white">{truck.truckId}</span>
                                        <span className={`text-xs font-bold ${truck.fuelLevel < 15 ? 'text-red-400' : 'text-orange-400'}`}>
                                            {truck.fuelLevel?.toFixed(0)}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1.5">{truck.driverName}</p>
                                    <div className="w-full h-1.5 bg-gray-800 rounded-full">
                                        <div
                                            className={`h-1.5 rounded-full ${truck.fuelLevel < 15 ? 'bg-red-500' : 'bg-orange-500'}`}
                                            style={{ width: `${truck.fuelLevel}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="glass-card p-6">
                    <h3 className="text-base font-semibold text-white mb-4">System Activity</h3>
                    <div className="space-y-3">
                        {[
                            { text: 'Live tracking simulation active', time: 'Every 5 sec', color: 'bg-green-500' },
                            { text: `${trucks.filter(t => t.engineStatus === 'running').length} trucks currently running`, time: 'Real-time', color: 'bg-blue-500' },
                            { text: `${stats.maintenanceAlerts} maintenance alerts pending`, time: 'Latest', color: 'bg-yellow-500' },
                            { text: `${stats.totalRoutes} routes planned total`, time: 'All time', color: 'bg-purple-500' },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activity.color}`}></div>
                                <div>
                                    <p className="text-sm text-gray-300">{activity.text}</p>
                                    <p className="text-xs text-gray-600">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Routes */}
            {recentRoutes.length > 0 && (
                <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-white">Recent Routes</h3>
                        <a href="/route-planner" className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                            View all <HiOutlineArrowRight className="text-xs" />
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table-dark">
                            <thead>
                                <tr><th>Route</th><th>Distance</th><th>Fuel</th><th>Cost</th><th>CO₂</th><th>Traffic</th></tr>
                            </thead>
                            <tbody>
                                {recentRoutes.map(route => (
                                    <tr key={route._id}>
                                        <td>
                                            <span className="text-red-400 font-medium">{route.source}</span>
                                            <span className="text-gray-600 mx-1">→</span>
                                            <span className="text-gray-300">{route.destination}</span>
                                        </td>
                                        <td>{route.distance} km</td>
                                        <td className="text-blue-400">{route.fuelConsumed} L</td>
                                        <td className="text-yellow-400">₹{route.fuelCost?.toLocaleString()}</td>
                                        <td className="text-orange-400">{route.carbonEmission} kg</td>
                                        <td>
                                            <span className={`badge text-xs ${route.trafficLevel === 'Low' ? 'badge-success' : route.trafficLevel === 'Medium' ? 'badge-warning' : 'badge-danger'}`}>
                                                {route.trafficLevel}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
