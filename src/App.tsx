// File: src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/routes/ProtectedRoute';
import GuestRoute from './components/routes/GuestRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import PollList from './pages/polls/PollList';
import PollCreation from './pages/polls/PollCreation';
import Ballot from './pages/ballot/Ballot';

export default function App() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900 dark:text-white">
                <div className="animate-pulse font-medium">Loading Application...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header is here -> Visible on ALL routes */}
            <Header />

            <Routes>
                {/* Root Redirect */}
                <Route
                    path="/"
                    element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
                />

                {/* Guest Routes: No Sidebar, just the Header */}
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Protected Routes: Header + Sidebar */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/polls" element={<PollList />} />
                        <Route path="/polls/create" element={<PollCreation />} />
                        <Route path="/ballot/:id" element={<Ballot />} />
                    </Route>
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}