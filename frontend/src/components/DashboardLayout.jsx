import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Sidebar />
            <Navbar />
            <main className="ml-64 mt-16 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
