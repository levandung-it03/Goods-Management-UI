import ExportPage from '@src/pages/Client/ExportPage/ExportPage';
import ManageGoods from '@src/pages/Client/ManageGoods/ManageGoods';
import LoginPage from '@src/pages/Public/LoginPage/LoginPage';
import RegisterPage from '@src/pages/Public/RegisterPage/RegisterPage';
import HomePage from '@src/pages/Client/HomePage/HomePage';
import AdminPage from '@src/pages/Admin/AdminPage';
import { AdminSidebarLayout, UserSidebarLayout } from '@src/layout/SidebarLayout';
import ImportPage from '@src/pages/Client/ImportPage/ImportPage';
import ManageSupplier from '@src/pages/Client/ManageSupplier/ManageSupplier';
import ManageWarehouse from '@src/pages/Client/ManageWarehouse/ManageWarehouse';

const publicRoutes = [
    // Example
    // { path: '/login', component: Page, layout: SidebarLayout },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
];

const adminRoutes = [
    { path: "/admin", component: AdminPage, layout: AdminSidebarLayout },
];

const userRoutes = [
    { path: '/', component: HomePage, layout: UserSidebarLayout },
    { path: '/user/manage-goods', component: ManageGoods, layout: UserSidebarLayout },
    { path: '/user/manage-supplier', component: ManageSupplier, layout: UserSidebarLayout },
    { path: '/user/manage-warehouse', component: ManageWarehouse, layout: UserSidebarLayout },
    { path: '/user/create-import', component: ImportPage, layout: UserSidebarLayout },
    { path: '/user/create-export', component: ExportPage, layout: AdminSidebarLayout },
];

export { publicRoutes, adminRoutes, userRoutes };
