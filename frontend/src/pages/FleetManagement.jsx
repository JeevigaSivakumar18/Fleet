import { useState, useEffect } from 'react';
import { trucksAPI } from '../services/api';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineTruck, HiOutlineX } from 'react-icons/hi';

const FleetManagement = () => {
    const [trucks, setTrucks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTruck, setEditingTruck] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        truckId: '', licensePlate: '', driverName: '', fuelEfficiency: '',
        tankCapacity: '', costPerLitre: '95', emissionFactor: '2.68', status: 'active',
    });

    useEffect(() => { fetchTrucks(); }, []);

    const fetchTrucks = async () => {
        try {
            const res = await trucksAPI.getAll();
            setTrucks(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const resetForm = () => {
        setForm({ truckId: '', licensePlate: '', driverName: '', fuelEfficiency: '', tankCapacity: '', costPerLitre: '95', emissionFactor: '2.68', status: 'active' });
        setEditingTruck(null);
    };

    const openAdd = () => { resetForm(); setShowModal(true); };
    const openEdit = (truck) => {
        setForm({
            truckId: truck.truckId, licensePlate: truck.licensePlate, driverName: truck.driverName,
            fuelEfficiency: truck.fuelEfficiency, tankCapacity: truck.tankCapacity,
            costPerLitre: truck.costPerLitre, emissionFactor: truck.emissionFactor, status: truck.status,
        });
        setEditingTruck(truck);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...form, fuelEfficiency: Number(form.fuelEfficiency), tankCapacity: Number(form.tankCapacity), costPerLitre: Number(form.costPerLitre), emissionFactor: Number(form.emissionFactor) };
            if (editingTruck) {
                await trucksAPI.update(editingTruck._id, data);
            } else {
                await trucksAPI.create(data);
            }
            setShowModal(false);
            resetForm();
            fetchTrucks();
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this truck?')) return;
        try {
            await trucksAPI.delete(id);
            fetchTrucks();
        } catch (err) { alert('Delete failed'); }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Fleet Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your trucks and drivers</p>
                </div>
                <button onClick={openAdd} className="btn-primary flex items-center gap-2">
                    <HiOutlinePlus /> Add Truck
                </button>
            </div>

            {/* Trucks Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-dark">
                        <thead>
                            <tr>
                                <th>Truck ID</th><th>License Plate</th><th>Driver</th><th>Fuel Eff. (km/l)</th>
                                <th>Tank (L)</th><th>Cost/L (₹)</th><th>CO₂/L (kg)</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="9" className="text-center py-8 text-gray-500">Loading...</td></tr>
                            ) : trucks.length === 0 ? (
                                <tr><td colSpan="9" className="text-center py-8 text-gray-500">No trucks found. Add your first truck.</td></tr>
                            ) : (
                                trucks.map((truck) => (
                                    <tr key={truck._id}>
                                        <td className="font-semibold text-red-400">{truck.truckId}</td>
                                        <td>{truck.licensePlate}</td>
                                        <td>{truck.driverName}</td>
                                        <td>{truck.fuelEfficiency}</td>
                                        <td>{truck.tankCapacity}</td>
                                        <td>₹{truck.costPerLitre}</td>
                                        <td>{truck.emissionFactor}</td>
                                        <td>
                                            <span className={`badge ${truck.status === 'active' ? 'badge-success' : truck.status === 'maintenance' ? 'badge-warning' : 'badge-danger'}`}>
                                                {truck.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openEdit(truck)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-all"><HiOutlinePencil /></button>
                                                <button onClick={() => handleDelete(truck._id)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-all"><HiOutlineTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">{editingTruck ? 'Edit Truck' : 'Add New Truck'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400"><HiOutlineX className="text-xl" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Truck ID</label>
                                    <input type="text" value={form.truckId} onChange={(e) => setForm({ ...form, truckId: e.target.value })} className="input-dark" required />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">License Plate</label>
                                    <input type="text" value={form.licensePlate} onChange={(e) => setForm({ ...form, licensePlate: e.target.value })} className="input-dark" required />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Driver Name</label>
                                <input type="text" value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })} className="input-dark" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Fuel Efficiency (km/l)</label>
                                    <input type="number" step="0.1" value={form.fuelEfficiency} onChange={(e) => setForm({ ...form, fuelEfficiency: e.target.value })} className="input-dark" required />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Tank Capacity (L)</label>
                                    <input type="number" value={form.tankCapacity} onChange={(e) => setForm({ ...form, tankCapacity: e.target.value })} className="input-dark" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Cost per Litre (₹)</label>
                                    <input type="number" step="0.01" value={form.costPerLitre} onChange={(e) => setForm({ ...form, costPerLitre: e.target.value })} className="input-dark" required />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Emission Factor (kg CO₂/L)</label>
                                    <input type="number" step="0.01" value={form.emissionFactor} onChange={(e) => setForm({ ...form, emissionFactor: e.target.value })} className="input-dark" required />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Status</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-dark">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="btn-primary flex-1">{editingTruck ? 'Update Truck' : 'Add Truck'}</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FleetManagement;
