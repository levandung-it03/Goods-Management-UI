import { AdminSidebarLayout } from "@src/layout/SidebarLayout";
import AdminPage from "@src/pages/Admin/AdminPage";
import ManageGoods from "@src/pages/Client/ManageGoods/ManageGoods";
import LoginPage from "@src/pages/Public/LoginPage/LoginPage";
import RegisterPage from "@src/pages/Public/RegisterPage/RegisterPage";
import HomePage from "@src/pages/Client/HomePage/HomePage";
import ProfileDialog from "@src/pages/Client/Profile/Profile";

const publicRoutes = [
    // Example
    // { path: '/login', component: Page, layout: SidebarLayout },
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
];

const adminRoutes = [
    { path: "/", component: AdminPage, layout: AdminSidebarLayout },
    // { path: '/', component: AdminPage },
];

const userRoutes = [
    { path: "/user/manage-goods", component: ManageGoods },
    { path: "/user", component: HomePage },
    { path: "/user/profile", component: ProfileDialog },
];

export { publicRoutes, adminRoutes, userRoutes };
