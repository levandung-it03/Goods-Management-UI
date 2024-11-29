import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import {
    adminRoutes,
    publicRoutes,
    userRoutes,
} from "@src/routes/routesConfig";
import { Fragment, useMemo } from "react";
import { useAuth } from "@src/hooks/useAuth";
import { UtilAxios } from "@reusable/Utils";
// import { getTokenPayload } from '@src/utils/helpers';

const ROLES = {
    ADMIN: "ROLE_ADMIN",
    USER: "ROLE_USER",
};

function App() {
    const { auth } = useAuth();
    const jwtClaims = UtilAxios.checkAndReadBase64Token(auth.accessToken);
    // Test
    // const jwtClaims = useMemo(
    //     () => ({
    //         scope: auth.accessToken ? 'ROLE_ADMIN' : '',
    //     }),
    //     [auth.accessToken],
    // );

    const routes = useMemo(() => {
        switch (jwtClaims["scope"]) {
            case ROLES.ADMIN:
                return adminRoutes;
            case ROLES.USER:
                return userRoutes;
            default:
                return publicRoutes;
        }
    }, [jwtClaims]);

    return (
        <div className="App">
            <Routes>
                {routes.map((route, index) => {
                    const Page = route.component;
                    const Layout = route.layout ? route.layout : Fragment;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout {...(route.layoutProps || {})}>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}

                {/* Route mặc định cho đường dẫn không xác định */}
                <Route
                    path="*"
                    element={
                        auth.accessToken ? (
                            <Navigate to="/" />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
