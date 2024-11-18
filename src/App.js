import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@Layouts/MainLayout';
import AuthLayout from '@Layouts/AuthLayout';
import Logout from '@Pages/Logout';
import HomePage from '@Pages/HomePage';
import LoginPage from '@Pages/LoginPage';
import SettingPage from '@Pages/SettingsPage';
import UsersPage from '@Pages/UsersPage';
import TestPage from './pages/TestPage/TestPage';

function App() {
  const tokenInCookies = document.cookie;
  const loginRole = tokenInCookies ? "admin" : "user";

  const mapMainLayout = (c) => <MainLayout loginRole={loginRole || "guest"}> {c} </MainLayout>;
  const mapAuthLayout = (c) => <AuthLayout> {c} </AuthLayout>;

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={mapMainLayout(<HomePage />)} />
          <Route path="/setting" element={mapMainLayout(<SettingPage />)} />
          <Route path="/users" element={mapMainLayout(<UsersPage />)} />
          <Route path="/test" element={<TestPage />} />
          
          <Route path="/login" element={mapAuthLayout(<LoginPage />)} />
          <Route path="/logout" element={mapAuthLayout(<Logout />)} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
