import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineTruck, HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '', role: 'manager' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(form.username, form.email, form.password, form.role);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-red-800/5 rounded-full blur-3xl"></div>
            </div>

            <div className="glass-card p-10 w-full max-w-md animate-fade-in relative">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mb-4 red-glow">
                        <HiOutlineTruck className="text-white text-3xl" />
                    </div>
                    <h1 className="text-2xl font-bold gradient-text">FleetX</h1>
                    <p className="text-gray-500 text-sm mt-1">Create your account</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input type="text" placeholder="Username" value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })} className="input-dark pl-11" required />
                    </div>
                    <div className="relative">
                        <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input type="email" placeholder="Email address" value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-dark pl-11" required />
                    </div>
                    <div className="relative">
                        <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input type="password" placeholder="Password (min 6 chars)" value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-dark pl-11" required minLength={6} />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Role</label>
                        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                            className="input-dark">
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-center disabled:opacity-50">
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-red-400 hover:text-red-300 font-medium">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
