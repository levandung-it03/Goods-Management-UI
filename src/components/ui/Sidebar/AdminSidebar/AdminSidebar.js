import { ChevronFirst, ChevronLast, LogOut } from 'lucide-react';
import { useState, Children, cloneElement, useCallback } from 'react';
import { useAuth } from '@src/hooks/useAuth';
import '../Sidebar.scss';

const name = 'Bảo Võ';
const email = 'vgbao1231@gmail.com';

function AdminSidebar({ children }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { logout } = useAuth();

    // Handle log out
    const handleLogout = useCallback(async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
        }
    }, [logout]);

    return (
        <aside className="sidebar">
            <div className="logo-container center">
                <div className={`logo${isExpanded ? ' expand' : ''}`}>
                    <img src="https://img.logoipsum.com/297.svg" alt="" />
                </div>
                <button className="toggle-sidebar center" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <ChevronFirst /> : <ChevronLast />}
                </button>
            </div>
            <div className="item-container">
                <ul>{Children.map(children, (child) => cloneElement(child, { isExpanded }))}</ul>
            </div>
            <div className="logout-container center" onClick={handleLogout}>
                <LogOut className="logout-icon" />
                <span className={`logout${isExpanded ? ' expand' : ''}`}>Log out</span>
            </div>
            <div className="divider"></div>
            <div className="profile-container center">
                <div className="avatar center">{name[0].toUpperCase()}</div>
                <div className={`info${isExpanded ? ' expand' : ''}`}>
                    <p className="name">{name}</p>
                    <p className="email">{email}</p>
                </div>
            </div>
        </aside>
    );
}

export default AdminSidebar;
