import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { trucksAPI } from '../services/api';
import { HiOutlineLocationMarker, HiOutlineLightningBolt, HiOutlineTruck } from 'react-icons/hi';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons for Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createTruckIcon = (status) => {
    const color = status === 'running' ? '#22c55e' : status === 'idle' ? '#f59e0b' : '#ef4444';
    return L.divIcon({
        className: '',
        html: `<div style="
            width:38px;height:38px;border-radius:50%;
            background:${color}22;border:2.5px solid ${color};
            display:flex;align-items:center;justify-content:center;
            box-shadow: 0 0 12px ${color}55;
        ">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="${color}" viewBox="0 0 24 24">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
        </div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20],
    });
};

const MapUpdater = ({ selectedTruck }) => {
    const map = useMap();
    useEffect(() => {
        if (selectedTruck) {
            map.setView([selectedTruck.latitude, selectedTruck.longitude], 8, { animate: true });
        }
    }, [selectedTruck, map]);
    return null;
};

const FuelBar = ({ level }) => (
    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
            className={`h-full rounded-full transition-all duration-500 ${level > 50 ? 'bg-green-500' : level > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${level}%` }}
        />
    </div>
);

const LiveTracking = () => {
    const [trucks, setTrucks] = useState([]);
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [connected, setConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        fetchTrucks();
        const socket = io('http://localhost:5000');
        socketRef.current = socket;

        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));
        socket.on('truckUpdate', (updates) => {
            setTrucks(updates);
            setSelectedTruck(prev => {
                if (!prev) return prev;
                return updates.find(t => t._id === prev._id) || prev;
            });
        });

        return () => { socket.disconnect(); };
    }, []);

    const fetchTrucks = async () => {
        try {
            const res = await trucksAPI.getAll();
            setTrucks(res.data);
        } catch (err) {
            console.error('Failed to fetch trucks:', err);
        }
    };

    const running = trucks.filter(t => t.engineStatus === 'running').length;
    const idle = trucks.filter(t => t.engineStatus === 'idle').length;
    const off = trucks.filter(t => t.engineStatus === 'off').length;

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Live Tracking</h1>
                    <p className="text-gray-500 text-sm mt-1">Real-time fleet monitoring across India</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className={`text-sm ${connected ? 'text-green-400' : 'text-red-400'}`}>
                            {connected ? 'Live' : 'Connecting...'}
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>{running} Running</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>{idle} Idle</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>{off} Off</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                {/* Map */}
                <div className="lg:col-span-3 glass-card overflow-hidden rounded-2xl" style={{ height: '72vh' }}>
                    <MapContainer
                        center={[22.5937, 78.9629]}
                        zoom={5}
                        style={{ width: '100%', height: '100%' }}
                        className="rounded-2xl"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                        {trucks.map((truck) => (
                            <Marker
                                key={truck._id}
                                position={[truck.latitude, truck.longitude]}
                                icon={createTruckIcon(truck.engineStatus)}
                                eventHandlers={{ click: () => setSelectedTruck(truck) }}
                            >
                                <Popup className="fleet-popup">
                                    <div style={{
                                        background: '#1a1a1a', color: '#fff', borderRadius: '12px',
                                        padding: '12px', minWidth: '200px', fontFamily: 'Inter, sans-serif'
                                    }}>
                                        <h3 style={{ color: '#f87171', fontWeight: 700, marginBottom: '8px', fontSize: '15px' }}>
                                            🚛 {truck.truckId}
                                        </h3>
                                        <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                                            <p><b>Driver:</b> {truck.driverName}</p>
                                            <p><b>Speed:</b> {truck.speed} km/h</p>
                                            <p><b>Fuel:</b> {truck.fuelLevel?.toFixed(1)}%</p>
                                            <p><b>Plate:</b> {truck.licensePlate}</p>
                                            <p><b>Engine:</b> <span style={{ color: truck.engineStatus === 'running' ? '#22c55e' : truck.engineStatus === 'idle' ? '#f59e0b' : '#ef4444' }}>{truck.engineStatus}</span></p>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        <MapUpdater selectedTruck={selectedTruck} />
                    </MapContainer>
                </div>

                {/* Truck List */}
                <div className="glass-card p-4 overflow-y-auto" style={{ maxHeight: '72vh' }}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 tracking-wider">Fleet Status ({trucks.length})</h3>
                    <div className="space-y-2">
                        {trucks.map((truck) => (
                            <div
                                key={truck._id}
                                onClick={() => setSelectedTruck(truck)}
                                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${selectedTruck?._id === truck._id
                                        ? 'bg-red-600/15 border border-red-500/30'
                                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-white">{truck.truckId}</span>
                                    <span className={`badge text-xs ${truck.engineStatus === 'running' ? 'badge-success'
                                            : truck.engineStatus === 'idle' ? 'badge-warning'
                                                : 'badge-danger'
                                        }`}>
                                        {truck.engineStatus}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">{truck.driverName}</p>
                                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                                    <span className="flex items-center gap-1">
                                        <HiOutlineLightningBolt /> {truck.speed} km/h
                                    </span>
                                    <span>{truck.fuelLevel?.toFixed(0)}% fuel</span>
                                </div>
                                <FuelBar level={truck.fuelLevel || 0} />
                            </div>
                        ))}

                        {trucks.length === 0 && (
                            <div className="text-center text-gray-600 text-sm py-8">
                                <HiOutlineTruck className="text-4xl mx-auto mb-3 text-gray-700" />
                                <p>No trucks detected</p>
                                <p className="text-xs mt-1">Make sure the backend is running</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveTracking;
