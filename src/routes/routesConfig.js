import { AdminSidebarLayout } from '@src/layout/SidebarLayout';
import AdminPage from '@src/pages/Admin/AdminPage';
import LoginPage from '@src/pages/Public/LoginPage/LoginPage';
import RegisterPage from '@src/pages/Public/RegisterPage/RegisterPage';

const publicRoutes = [
    // Example
    // { path: '/login', component: Page, layout: SidebarLayout },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
];

const adminRoutes = [
    { path: '/', component: AdminPage, layout: AdminSidebarLayout },
    // { path: '/', component: AdminPage },
];

const userRoutes = [];

export { publicRoutes, adminRoutes, userRoutes };
