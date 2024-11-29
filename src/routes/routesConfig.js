import AdminPage from '@src/pages/Admin/AdminPage';
import ManageGoods from '@src/pages/Client/ManageGoods/ManageGoods';
import LoginPage from '@src/pages/Public/LoginPage/LoginPage';
import RegisterPage from '@src/pages/Public/RegisterPage/RegisterPage';

const publicRoutes = [
    // Example
    // { path: '/login', component: Page, layout: SidebarLayout, layoutProps: {sidebarItems: [1,2,3]} },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
];

const adminRoutes = [
    { path: '/', component: AdminPage },
    // { path: '/', component: AdminPage },
];

const userRoutes = [
    { path: '/user/manage-goods', component: ManageGoods },
];

export { publicRoutes, adminRoutes, userRoutes };
