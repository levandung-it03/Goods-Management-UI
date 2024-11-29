import AdminPage from "@src/pages/Admin/AdminPage";
import LoginPage from "@src/pages/Public/LoginPage/LoginPage";
import RegisterPage from "@src/pages/Public/RegisterPage/RegisterPage";
import HomePage from "@src/pages/User/HomePage/HomePage";
import ProfileDialog from "@src/pages/User/Profile/Profile";

const publicRoutes = [
    // Example
    // { path: '/login', component: Page, layout: SidebarLayout, layoutProps: {sidebarItems: [1,2,3]} },
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
];

const adminRoutes = [
    { path: "/", component: AdminPage },
    // { path: '/', component: AdminPage },
];

const userRoutes = [
    { path: "/user", component: HomePage },
    { path: "/user/profile", component: ProfileDialog },
];

export { publicRoutes, adminRoutes, userRoutes };
