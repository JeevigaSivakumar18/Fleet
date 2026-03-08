import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { HiOutlineChartBar, HiOutlineUpload, HiOutlineDocumentText } from 'react-icons/hi';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3 shadow-xl">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            {payload.map((item, i) => (
                <p key={i} className="text-sm font-semibold" style={{ color: item.color }}>{item.name}: {item.value}</p>
            ))}
        </div>
    );
};

const Analytics = () => {
    const [fuelData, setFuelData] = useState([]);
    const [maintenanceCostData, setMaintenanceCostData] = useState([]);
    const [co2Data, setCo2Data] = useState([]);
    const [deliveryTimeData, setDeliveryTimeData] = useState([]);
    const [trafficData, setTrafficData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    useEffect(() => { fetchAllData(); }, []);

    const fetchAllData = async () => {
        try {
            const [fuel, mCost, co2, delivery, traffic] = await Promise.all([
                analyticsAPI.getFuelConsumption(),
                analyticsAPI.getMaintenanceCost(),
                analyticsAPI.getCO2Emissions(),
                analyticsAPI.getDeliveryTime(),
                analyticsAPI.getTrafficImpact(),
            ]);
            setFuelData(fuel.data);
            setMaintenanceCostData(mCost.data);
            setCo2Data(co2.data);
            setDeliveryTimeData(delivery.data);
            setTrafficData(traffic.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCSVUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        setUploadMessage('');
        try {
            const formData = new FormData();
            formData.append('csvFile', file);
            formData.append('type', type);
            const res = await analyticsAPI.uploadCSV(formData);
            setUploadMessage(`✅ ${type} data uploaded and processed successfully!`);

            if (res.data.data) {
                if (type === 'trucks') {
                    if (res.data.data.fuelConsumption) setFuelData(res.data.data.fuelConsumption);
                    if (res.data.data.co2Emissions) setCo2Data(res.data.data.co2Emissions);
                    if (res.data.data.deliveryTime) setDeliveryTimeData(res.data.data.deliveryTime);
                    if (res.data.data.maintenanceCost) setMaintenanceCostData(res.data.data.maintenanceCost);
                } else if (type === 'traffic') {
                    if (res.data.data.trafficImpact) setTrafficData(res.data.data.trafficImpact);
                }
            }
        } catch (err) {
            setUploadMessage('❌ Upload failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <HiOutlineChartBar className="text-red-400" /> Data Analytics
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Advanced fleet analytics & data insights</p>
                </div>
            </div>

            {/* CSV Upload Section */}
            <div className="glass-card p-5 mb-6">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <HiOutlineUpload className="text-red-400" /> Upload CSV Data
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineDocumentText className="text-blue-400 text-xl" />
                            <div>
                                <p className="text-sm font-medium text-white">Truck Operational Data</p>
                                <p className="text-xs text-gray-500">trucks_data.csv format</p>
                            </div>
                        </div>
                        <label className="btn-secondary text-sm cursor-pointer inline-flex items-center gap-2">
                            <HiOutlineUpload /> Choose File
                            <input type="file" accept=".csv" onChange={(e) => handleCSVUpload(e, 'trucks')} className="hidden" />
                        </label>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineDocumentText className="text-green-400 text-xl" />
                            <div>
                                <p className="text-sm font-medium text-white">Traffic Data</p>
                                <p className="text-xs text-gray-500">traffic_data.csv format</p>
                            </div>
                        </div>
                        <label className="btn-secondary text-sm cursor-pointer inline-flex items-center gap-2">
                            <HiOutlineUpload /> Choose File
                            <input type="file" accept=".csv" onChange={(e) => handleCSVUpload(e, 'traffic')} className="hidden" />
                        </label>
                    </div>
                </div>
                {uploadMessage && (
                    <p className={`mt-3 text-sm ${uploadMessage.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{uploadMessage}</p>
                )}
                {uploading && <p className="mt-3 text-sm text-yellow-400">Processing CSV file...</p>}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Fuel Consumption - Line Chart */}
                <div className="glass-card p-5">
                    <h3 className="text-base font-semibold text-white mb-4">Total Fuel Consumption</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={fuelData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" stroke="#666" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#666" tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="fuelConsumed" name="Fuel (L)" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Maintenance Cost - Bar Chart */}
                <div className="glass-card p-5">
                    <h3 className="text-base font-semibold text-white mb-4">Monthly Maintenance Cost</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={maintenanceCostData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" stroke="#666" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#666" tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="cost" name="Cost (₹)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* CO2 Emissions - Area Chart */}
                <div className="glass-card p-5">
                    <h3 className="text-base font-semibold text-white mb-4">CO₂ Emissions Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={co2Data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" stroke="#666" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#666" tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <defs>
                                <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="co2" name="CO₂ (kg)" stroke="#ef4444" strokeWidth={2.5} fill="url(#co2Gradient)" dot={{ fill: '#ef4444', r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Average Delivery Time - Line Chart */}
                <div className="glass-card p-5">
                    <h3 className="text-base font-semibold text-white mb-4">Average Delivery Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={deliveryTimeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" stroke="#666" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#666" tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="avgDeliveryTime" name="Avg Time (min)" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Traffic Impact - Pie Chart */}
                <div className="glass-card p-5 lg:col-span-2">
                    <h3 className="text-base font-semibold text-white mb-4">Traffic Impact Analysis</h3>
                    <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie data={trafficData} cx="50%" cy="50%" outerRadius={120} innerRadius={60} dataKey="value" nameKey="name"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: '#666' }}>
                                    {trafficData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
