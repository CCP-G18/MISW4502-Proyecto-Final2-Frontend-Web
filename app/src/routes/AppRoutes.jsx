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
import Producers from '../pages/Producers';
import CreateProducer from '../pages/CreateProducer';
import CreateProductMassive from '../pages/CreateProductMassive';
import ReportSalesPlan from '../pages/ReportSalesPlan';
import ProductDetail from '../pages/ProductDetail';
import DeliveryRoutes from '../pages/DeliveryRoutes';

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
                    <Route path="/productos/:productId" element={ <ProductDetail /> } />
                    <Route path="/fabricantes" element={<Producers />} />
                    <Route path="/fabricantes/crear" element={ <CreateProducer /> } />
                    <Route path="/vendedores/planes-venta/:sellerId" element={ <SalesPlan /> } />
                    <Route path="/vendedores/planes-venta/crear/:sellerId" element={ <CreateSalesPlan /> } />
                    <Route path="/productos/crear-masivo" element={<CreateProductMassive />} />
                    <Route path="/vendedores/informe" element={<ReportSalesPlan />} />
                    <Route path="/rutas-de-entrega" element={<DeliveryRoutes />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;