import UserSidebar from '@ui/Sidebar/UserSidebar/UserSidebar';
import SidebarItem from '@ui/Sidebar/SidebarItem/SidebarItem';
import { Package, PackageMinus, PackagePlus, UserRoundPen } from 'lucide-react';
import AdminSidebar from '@ui/Sidebar/AdminSidebar/AdminSidebar';

const sidebarStyles = { display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' };

export function UserSidebarLayout({ children }) {
    return (
        <div style={sidebarStyles}>
            <UserSidebar>
                <SidebarItem icon={<Package />} text="Manage Goods" path={['/', '/user/manage-goods']} />
                <SidebarItem icon={<PackageMinus />} text="Create Export Bill" path="/user/create-export" />
                <SidebarItem icon={<PackagePlus />} text="Create Import Bill" path="/user/create-import" />
                <SidebarItem icon={<UserRoundPen />} text="Profile" path="/user/profile" />
            </UserSidebar>
            <div className="container" style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}

export function AdminSidebarLayout({ children }) {
    return (
        <div style={sidebarStyles}>
            <AdminSidebar>
                <SidebarItem icon={<Package />} text="Manage Goods" path={['/', '/user/manage-goods']} />
                <SidebarItem icon={<PackageMinus />} text="Create Export Bill" path="/user/create-export" />
            </AdminSidebar>
            <div className="container" style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}
