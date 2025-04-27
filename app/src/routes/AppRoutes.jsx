import { Route, Routes } from 'react-router';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Logout from '../pages/Logout';
import Sellers from '../pages/Sellers';
import Products from '../pages/Products';
import CreateSeller from '../pages/CreateSeller';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import PrivateRoute from './PrivateRoute';
import CreateProduct from '../pages/CreateProduct';
import SalesPlan from '../pages/SalesPlan';
import CreateSalesPlan from '../pages/CreateSalesPlan';

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
                    <Route path="/productos" element={<Products />} />
                    <Route path="/productos/crear" element={ <CreateProduct /> } />
                    <Route path="/vendedores/planes-venta/:sellerId" element={ <SalesPlan /> } />
                    <Route path="/vendedores/planes-venta/crear/:sellerId" element={ <CreateSalesPlan /> } />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;