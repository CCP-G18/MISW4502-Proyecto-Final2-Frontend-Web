import { Route, Routes } from 'react-router';
import Home from '../pages/Home';
import Login from '../pages/Login';
import AuthLayout from '../layouts/AuthLayout';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<AuthLayout />}>
                <Route index element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;