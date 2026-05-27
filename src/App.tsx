import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import ProtectedRoute from './components/routes/ProtectedRoute';
import GuestRoute from './components/routes/GuestRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import PollList from './pages/polls/PollList';
import PollCreation from './pages/polls/PollCreation';
import Ballot from './pages/ballot/Ballot';

function App() {
    return (
        <>
            <Header />
            <Routes>
                {/* Guest routes */}
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/polls" element={<PollList />} />
                    <Route path="/polls/create" element={<PollCreation />} />
                    <Route path="/ballot/:id" element={<Ballot />} />
                </Route>

                {/* Catch‑all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </>
    );
}

export default App;