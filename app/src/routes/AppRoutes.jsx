import { Route, Routes } from 'react-router';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Logout from '../pages/Logout';
import Sellers from '../pages/Sellers';
import CreateSeller from '../pages/CreateSeller';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
            </Route>
            <Route path='/' element={<MainLayout />}>
                <Route element={<PrivateRoute />}>
                    <Route index element={<Home />} />
                    <Route path="/vendedores" element={<Sellers />} />
                    <Route path="/vendedores/crear" element={<CreateSeller />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;