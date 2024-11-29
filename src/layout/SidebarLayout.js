import AdminSidebar from '@ui/Sidebar/AdminSidebar/AdminSidebar';
import SidebarItem from '@ui/Sidebar/SidebarItem/SidebarItem';
import { Images, LayoutDashboard, SquareUserRound } from 'lucide-react';

const sidebarStyles = { display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' };

export function AdminSidebarLayout({ children }) {
    return (
        <div className="container" style={sidebarStyles}>
            <AdminSidebar>
                <SidebarItem icon={<LayoutDashboard />} text="Dashboard" path="/" />
                <SidebarItem icon={<SquareUserRound />} text="User Information" path="/manage-user-info" />
                <SidebarItem icon={<Images />} text="Slides" path="/manage-slides" />
            </AdminSidebar>
            <div className="container" style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}
