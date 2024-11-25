import { useAuth } from '@src/hooks/useAuth';
import { useCallback } from 'react';

function AdminPage() {
    const { logout } = useAuth();
    const handleLogout = useCallback(async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
        }
    }, [logout]);

    return (
        <div>
            Admin
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default AdminPage;
