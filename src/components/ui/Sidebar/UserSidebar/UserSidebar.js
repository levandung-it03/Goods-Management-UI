import { ChevronFirst, ChevronLast, LogOut } from 'lucide-react';
import { useState, Children, cloneElement, useCallback, useEffect } from 'react';
import { useAuth } from '@src/hooks/useAuth';
import Dialog from '@reusable/Dialog/Dialog';
import { UtilAxios } from '@reusable/Utils';
import { cookieHelpers } from '@src/utils/helpers';
import { ProfileService } from '@services/ProfileService';

import '../Sidebar.scss';
import UserProfileDialog from './UserProfileDialog/UserProfileDialog';

function UserSidebar({ children }) {
    const [dialogContent, setDialogContent] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const jwtClaims = UtilAxios.checkAndReadBase64Token(cookieHelpers.getCookies().accessToken);
    const [userProfile, setUserProfile] = useState();
    const { logout } = useAuth();

    // Handle log out
    const handleLogout = useCallback(async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
        }
    }, [logout]);

    const handleOpenProfileDialog = useCallback(
        () => setDialogContent(<UserProfileDialog userProfile={{ ...userProfile, email: jwtClaims.sub }} />),
        [userProfile],
    );

    // Khi modal mở, gọi API lấy dữ liệu
    useEffect(() => {
        // Gọi API lấy thông tin người dùng
        const fetchUserProfile = async () => {
            try {
                let data = await ProfileService.getUserProfile();
                data = data.data;
                const year = data.dob[0];
                const month = String(data.dob[1]).padStart(2, '0'); // Đảm bảo tháng có 2 chữ số
                const day = String(data.dob[2]).padStart(2, '0'); // Đảm bảo ngày có 2 chữ số
                data.dob = `${year}-${month}-${day}`;
                setUserProfile(data); // Lưu dữ liệu vào state
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        };
        fetchUserProfile();
    }, [dialogContent]);

    return !userProfile ? (
        <div></div> // Loading
    ) : (
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
            <div className="profile-container center" onClick={handleOpenProfileDialog}>
                <div className="avatar center">{userProfile.firstName[0].toUpperCase()}</div>
                <div className={`info${isExpanded ? ' expand' : ''}`}>
                    <p className="name">
                        {userProfile.lastName} {userProfile.firstName}
                    </p>
                    <p className="email">{jwtClaims.sub}</p>
                </div>
            </div>
            <Dialog dialogContent={dialogContent} setDialogContent={setDialogContent} />
        </aside>
    );
}

export default UserSidebar;
