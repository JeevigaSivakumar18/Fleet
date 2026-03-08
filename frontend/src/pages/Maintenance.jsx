import { useState, useEffect } from 'react';
import { maintenanceAPI, trucksAPI } from '../services/api';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineExclamation, HiOutlineX, HiOutlineClock } from 'react-icons/hi';

const Maintenance = () => {
    const [records, setRecords] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [overdueRecords, setOverdueRecords] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        truckId: '', serviceType: '', lastServiceDate: '', nextServiceDue: '', odometer: '', notes: '', cost: '', status: 'pending',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [recRes, truckRes, overdueRes] = await Promise.all([
                maintenanceAPI.getAll(), trucksAPI.getAll(), maintenanceAPI.getOverdue(),
            ]);
            setRecords(recRes.data);
            setTrucks(truckRes.data);
            setOverdueRecords(overdueRes.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const resetForm = () => {
        setForm({ truckId: '', serviceType: '', lastServiceDate: '', nextServiceDue: '', odometer: '', notes: '', cost: '', status: 'pending' });
        setEditingRecord(null);
    };

    const openAdd = () => { resetForm(); setShowModal(true); };
    const openEdit = (record) => {
        setForm({
            truckId: record.truckId?._id || record.truckId,
            serviceType: record.serviceType,
            lastServiceDate: record.lastServiceDate?.split('T')[0] || '',
            nextServiceDue: record.nextServiceDue?.split('T')[0] || '',
            odometer: record.odometer, notes: record.notes || '', cost: record.cost || 0, status: record.status,
        });
        setEditingRecord(record);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...form, odometer: Number(form.odometer), cost: Number(form.cost || 0) };
            if (editingRecord) {
                await maintenanceAPI.update(editingRecord._id, data);
            } else {
                await maintenanceAPI.create(data);
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this maintenance record?')) return;
        try { await maintenanceAPI.delete(id); fetchData(); }
        catch (err) { alert('Delete failed'); }
    };

    const isOverdue = (date) => new Date(date) < new Date();

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Maintenance</h1>
                    <p className="text-gray-500 text-sm mt-1">Track service logs and upcoming maintenance</p>
                </div>
                <button onClick={openAdd} className="btn-primary flex items-center gap-2"><HiOutlinePlus /> New Service Log</button>
            </div>

            {/* Overdue Alerts */}
            {overdueRecords.length > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-fade-in">
                    <div className="flex items-center gap-2 mb-3">
                        <HiOutlineExclamation className="text-red-400 text-xl" />
                        <h3 className="text-base font-semibold text-red-400">Overdue Maintenance Alerts ({overdueRecords.length})</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {overdueRecords.map((rec) => (
                            <div key={rec._id} className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                <p className="text-sm font-semibold text-white">{rec.truckId?.truckId || 'Unknown Truck'}</p>
                                <p className="text-xs text-gray-400">{rec.serviceType}</p>
                                <p className="text-xs text-red-400 mt-1">Due: {new Date(rec.nextServiceDue).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-dark">
                        <thead>
                            <tr><th>Truck</th><th>Service Type</th><th>Last Service</th><th>Next Due</th><th>Odometer</th><th>Cost (₹)</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" className="text-center py-8 text-gray-500">Loading...</td></tr>
                            ) : records.length === 0 ? (
                                <tr><td colSpan="8" className="text-center py-8 text-gray-500">No maintenance records. Create one.</td></tr>
                            ) : (
                                records.map((rec) => (
                                    <tr key={rec._id}>
                                        <td className="font-semibold text-red-400">{rec.truckId?.truckId || 'N/A'}</td>
                                        <td>{rec.serviceType}</td>
                                        <td>{new Date(rec.lastServiceDate).toLocaleDateString()}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {isOverdue(rec.nextServiceDue) && rec.status !== 'completed' && (
                                                    <HiOutlineExclamation className="text-red-400" />
                                                )}
                                                <span className={isOverdue(rec.nextServiceDue) && rec.status !== 'completed' ? 'text-red-400' : ''}>
                                                    {new Date(rec.nextServiceDue).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{rec.odometer?.toLocaleString()} km</td>
                                        <td>₹{rec.cost?.toLocaleString()}</td>
                                        <td>
                                            <span className={`badge ${rec.status === 'completed' ? 'badge-success' : rec.status === 'overdue' ? 'badge-danger' : 'badge-warning'}`}>
                                                {rec.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openEdit(rec)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-blue-400"><HiOutlinePencil /></button>
                                                <button onClick={() => handleDelete(rec._id)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400"><HiOutlineTrash /></button>
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
                            <h2 className="text-xl font-bold text-white">{editingRecord ? 'Edit Record' : 'New Service Log'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400"><HiOutlineX className="text-xl" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Truck</label>
                                <select value={form.truckId} onChange={(e) => setForm({ ...form, truckId: e.target.value })} className="input-dark" required>
                                    <option value="">Select truck</option>
                                    {trucks.map(t => <option key={t._id} value={t._id}>{t.truckId} - {t.driverName}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Service Type</label>
                                <input type="text" placeholder="e.g. Oil Change, Tire Rotation" value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })} className="input-dark" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Last Service Date</label>
                                    <input type="date" value={form.lastServiceDate} onChange={(e) => setForm({ ...form, lastServiceDate: e.target.value })} className="input-dark" required />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Next Service Due</label>
                                    <input type="date" value={form.nextServiceDue} onChange={(e) => setForm({ ...form, nextServiceDue: e.target.value })} className="input-dark" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Odometer (km)</label>
                                    <input type="number" value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} className="input-dark" required />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Cost (₹)</label>
                                    <input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="input-dark" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Status</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-dark">
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Notes</label>
                                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-dark" rows={3} placeholder="Additional notes..."></textarea>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="btn-primary flex-1">{editingRecord ? 'Update' : 'Create'}</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Maintenance;
