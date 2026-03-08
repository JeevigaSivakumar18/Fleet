import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { routesAPI, trucksAPI } from '../services/api';
import { HiOutlineMap, HiOutlineLocationMarker, HiOutlineClock, HiOutlineFire, HiOutlineCurrencyRupee, HiOutlineGlobe, HiOutlineTrash } from 'react-icons/hi';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Major Indian city coordinates for route calculation
const CITY_COORDS = {
    'delhi': [28.6139, 77.2090], 'new delhi': [28.6139, 77.2090],
    'mumbai': [19.0760, 72.8777], 'bombay': [19.0760, 72.8777],
    'chennai': [13.0827, 80.2707], 'madras': [13.0827, 80.2707],
    'kolkata': [22.5726, 88.3639], 'calcutta': [22.5726, 88.3639],
    'bangalore': [12.9716, 77.5946], 'bengaluru': [12.9716, 77.5946],
    'hyderabad': [17.3850, 78.4867], 'ahmedabad': [23.0225, 72.5714],
    'jaipur': [26.9124, 75.7873], 'surat': [21.1702, 72.8311],
    'pune': [18.5204, 73.8567], 'lucknow': [26.8467, 80.9462],
    'nagpur': [21.1458, 79.0882], 'bhopal': [23.2599, 77.4126],
    'chandigarh': [30.7333, 76.7794], 'patna': [25.5941, 85.1376],
    'kochi': [9.9312, 76.2673], 'coimbatore': [11.0168, 76.9558],
    'visakhapatnam': [17.6868, 83.2185], 'indore': [22.7196, 75.8577],
    'vadodara': [22.3072, 73.1812], 'agra': [27.1767, 78.0081],
    'kanpur': [26.4499, 80.3319], 'varanasi': [25.3176, 82.9739],
};

const getCityCoords = (cityName) => {
    return CITY_COORDS[cityName.toLowerCase().trim()] || null;
};

const calcDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const RouteMapUpdater = ({ sourceCoords, destCoords }) => {
    const map = useMap();
    useEffect(() => {
        if (sourceCoords && destCoords) {
            const bounds = L.latLngBounds([sourceCoords, destCoords]);
            map.fitBounds(bounds, { padding: [50, 50], animate: true });
        }
    }, [sourceCoords, destCoords, map]);
    return null;
};

const getTrafficColor = (level) => {
    if (level === 'Low') return { text: 'text-green-400', bg: 'bg-green-500/15', dot: 'bg-green-500' };
    if (level === 'Medium') return { text: 'text-yellow-400', bg: 'bg-yellow-500/15', dot: 'bg-yellow-500' };
    return { text: 'text-red-400', bg: 'bg-red-500/15', dot: 'bg-red-500' };
};

const RoutePlanner = () => {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [selectedTruckId, setSelectedTruckId] = useState('');
    const [trucks, setTrucks] = useState([]);
    const [result, setResult] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sourceCoords, setSourceCoords] = useState(null);
    const [destCoords, setDestCoords] = useState(null);

    useEffect(() => {
        trucksAPI.getAll().then(res => setTrucks(res.data)).catch(console.error);
        routesAPI.getAll().then(res => setRoutes(res.data)).catch(console.error);
    }, []);

    const handlePlanRoute = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        setSourceCoords(null);
        setDestCoords(null);

        const sCoords = getCityCoords(source);
        const dCoords = getCityCoords(destination);

        let distance = undefined;
        if (sCoords && dCoords) {
            distance = parseFloat(calcDistance(sCoords[0], sCoords[1], dCoords[0], dCoords[1]).toFixed(1));
            setSourceCoords(sCoords);
            setDestCoords(dCoords);
        }

        try {
            const res = await routesAPI.plan({
                source,
                destination,
                truckId: selectedTruckId || undefined,
                distance,
            });
            setResult(res.data.route);
            // Refresh routes list
            routesAPI.getAll().then(r => setRoutes(r.data)).catch(() => { });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to plan route. Try again.');
        }
        setLoading(false);
    };

    const handleDeleteRoute = async (id) => {
        if (!window.confirm('Delete this route?')) return;
        try {
            await routesAPI.delete(id);
            setRoutes(routes.filter(r => r._id !== id));
        } catch {
            alert('Delete failed');
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Route Planner</h1>
                <p className="text-gray-500 text-sm mt-1">Plan optimized routes with fuel, cost & emission analysis</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                {/* Input Panel */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <HiOutlineMap className="text-red-400" /> Plan Route
                    </h3>
                    <form onSubmit={handlePlanRoute} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Source City</label>
                            <input
                                type="text"
                                placeholder="e.g. Delhi, Mumbai"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                className="input-dark"
                                required
                                list="cities"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Destination City</label>
                            <input
                                type="text"
                                placeholder="e.g. Chennai, Kolkata"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="input-dark"
                                required
                                list="cities"
                            />
                        </div>
                        <datalist id="cities">
                            {Object.keys(CITY_COORDS).filter(c => c.length > 4).map(c => (
                                <option key={c} value={c.charAt(0).toUpperCase() + c.slice(1)} />
                            ))}
                        </datalist>
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Select Truck (optional)</label>
                            <select
                                value={selectedTruckId}
                                onChange={(e) => setSelectedTruckId(e.target.value)}
                                className="input-dark"
                            >
                                <option value="">Default truck</option>
                                {trucks.map(t => (
                                    <option key={t._id} value={t._id}>{t.truckId} - {t.driverName}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
                            {loading ? 'Calculating...' : 'Calculate Route'}
                        </button>
                    </form>

                    {error && <div className="mt-4 p-3 rounded-xl bg-red-500/10 text-red-400 text-sm">{error}</div>}

                    {/* Results */}
                    {result && (
                        <div className="mt-6 space-y-2 animate-fade-in">
                            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Route Results</h4>
                            {[
                                { icon: HiOutlineLocationMarker, label: 'Distance', value: `${result.distance} km`, color: 'text-blue-400' },
                                { icon: HiOutlineClock, label: 'Est. Time', value: result.duration, color: 'text-purple-400' },
                                { icon: HiOutlineFire, label: 'Fuel Consumed', value: `${result.fuelConsumed} L`, color: 'text-blue-400' },
                                { icon: HiOutlineCurrencyRupee, label: 'Fuel Cost', value: `₹${result.fuelCost?.toLocaleString()}`, color: 'text-yellow-400' },
                                { icon: HiOutlineGlobe, label: 'CO₂ Emission', value: `${result.carbonEmission} kg`, color: 'text-orange-400' },
                            ].map(({ icon: Icon, label, value, color }) => (
                                <div key={label} className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                    <span className="text-sm text-gray-400 flex items-center gap-2">
                                        <Icon className="text-gray-500" /> {label}
                                    </span>
                                    <span className={`text-sm font-semibold ${color}`}>{value}</span>
                                </div>
                            ))}
                            <div className={`flex justify-between items-center p-3 rounded-xl ${getTrafficColor(result.trafficLevel).bg}`}>
                                <span className="text-sm text-gray-400">Traffic Level</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${getTrafficColor(result.trafficLevel).dot}`}></div>
                                    <span className={`text-sm font-semibold ${getTrafficColor(result.trafficLevel).text}`}>{result.trafficLevel}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Map */}
                <div className="lg:col-span-2 glass-card overflow-hidden rounded-2xl" style={{ height: '480px' }}>
                    <MapContainer
                        center={[22.5937, 78.9629]}
                        zoom={5}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                        {sourceCoords && (
                            <Marker position={sourceCoords}>
                                <Popup><b style={{ color: '#22c55e' }}>📍 {source}</b></Popup>
                            </Marker>
                        )}
                        {destCoords && (
                            <Marker position={destCoords}>
                                <Popup><b style={{ color: '#f87171' }}>🏁 {destination}</b></Popup>
                            </Marker>
                        )}
                        {sourceCoords && destCoords && (
                            <Polyline
                                positions={[sourceCoords, destCoords]}
                                pathOptions={{ color: '#dc2626', weight: 4, dashArray: '10 8', opacity: 0.9 }}
                            />
                        )}
                        {!sourceCoords && !destCoords && (
                            <></>
                        )}
                        <RouteMapUpdater sourceCoords={sourceCoords} destCoords={destCoords} />
                    </MapContainer>
                    {!sourceCoords && !destCoords && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <div className="glass-card p-5 text-center max-w-xs">
                                <HiOutlineLocationMarker className="text-5xl text-red-400 mx-auto mb-3" />
                                <p className="text-white text-sm font-medium">Enter Indian cities above</p>
                                <p className="text-gray-500 text-xs mt-1">The route will appear on the map</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Route History */}
            {routes.length > 0 && (
                <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-white">Route History</h3>
                        <span className="text-xs text-gray-500">{routes.length} routes planned</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table-dark">
                            <thead>
                                <tr>
                                    <th>Route</th>
                                    <th>Distance</th>
                                    <th>Duration</th>
                                    <th>Fuel (L)</th>
                                    <th>Cost</th>
                                    <th>CO₂ (kg)</th>
                                    <th>Traffic</th>
                                    <th>Truck</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {routes.slice(0, 10).map((route) => (
                                    <tr key={route._id}>
                                        <td>
                                            <span className="text-red-400 font-medium">{route.source}</span>
                                            <span className="text-gray-600 mx-1">→</span>
                                            <span className="text-gray-300">{route.destination}</span>
                                        </td>
                                        <td>{route.distance} km</td>
                                        <td>{route.duration}</td>
                                        <td className="text-blue-400">{route.fuelConsumed}</td>
                                        <td className="text-yellow-400">₹{route.fuelCost?.toLocaleString()}</td>
                                        <td className="text-orange-400">{route.carbonEmission}</td>
                                        <td>
                                            <span className={`badge text-xs ${route.trafficLevel === 'Low' ? 'badge-success'
                                                    : route.trafficLevel === 'Medium' ? 'badge-warning'
                                                        : 'badge-danger'
                                                }`}>{route.trafficLevel}</span>
                                        </td>
                                        <td className="text-gray-400 text-xs">{route.truckId?.truckId || '-'}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteRoute(route._id)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-all"
                                            >
                                                <HiOutlineTrash />
                                            </button>
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

export default RoutePlanner;
