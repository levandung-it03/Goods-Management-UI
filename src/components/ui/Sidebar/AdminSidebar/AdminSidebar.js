import { ChevronFirst, ChevronLast, LogOut } from 'lucide-react';
import { useState, Children, cloneElement, useCallback, useEffect } from 'react';
import { useAuth } from '@src/hooks/useAuth';
import '../Sidebar.scss';
import { cookieHelpers } from '@src/utils/helpers';
import { UtilAxios } from '@reusable/Utils';
import { AdminService } from "@services/adminService"

function AdminSidebar({ children }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { logout } = useAuth();
    const jwtClaims = UtilAxios.checkAndReadBase64Token(cookieHelpers.getCookies().accessToken);
	const [adminInformation, setAdminInformation] = useState({
		firstName: 'First name',
		lastName: 'Last name',
	});

    // Handle log out
    const handleLogout = useCallback(async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
        }
    }, [logout]);

	const fetchAdminInformation = async () => {
		if (!jwtClaims) return;

		const response = await AdminService.getAdminInformation();
		if (!response.data) return;

		setAdminInformation(response.data);
	}

    useEffect(() => {
		fetchAdminInformation();
    }, [])

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
                <div className="avatar center">{adminInformation.firstName[0].toUpperCase()}</div>
                <div className={`info${isExpanded ? ' expand' : ''}`}>
                    <p className="name">{`${adminInformation.lastName} ${adminInformation.firstName}`}</p>
                    <p className="email">{jwtClaims.sub}</p>
                </div>
            </div>
        </aside>
    );
}

export default AdminSidebar;
