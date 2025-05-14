import { useEffect, useMemo, useRef, useState } from "react";
import { useNotification } from "../context/NotificationContext";
import Loader from "../components/Loader";
import { useLocation, useNavigate } from "react-router";
import { formatCurrency } from "../utils/formatters";
import { generateReportSeller } from "../api/sellers";


const ReportSalesPlan = () => {
    const location = useLocation();
    const seller = useMemo(() => location.state?.seller || {}, []);
    const [salesPlans, setSalesPlans] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const notified = useRef(false);
    const fetched = useRef(false);

    useEffect(() => {
        if (!notified.current && location.state?.showNotification) {
            showNotification(
                location.state.type,
                location.state.title,
                location.state.message
            );
            notified.current = true;
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, location.pathname, navigate, showNotification]);

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                console.log("seller get Report", seller);
                const response = await generateReportSeller(seller.id);
                const data = response.data.data;
                setSalesPlans(data.planes || []);
                seller.sales_goals_total = data.sales_goal;
                seller.achieved_amount_total = data.achieved_amount;
            } catch (err) {
                setError("No se pudo generar el informe");
            } finally {
                setLoading(false);
            }
        };

        if (seller?.id && !fetched.current) {
            fetched.current = true;
            fetchReport();
        }
    }, [seller]);

    if (loading) {
        return (
            <Loader text="Cargando reporte..." />
        );
    }

    if (error) {
        return (
            <p className="text-center mt-10" >
                {error}
            </p>
        );
    }

    return (
        <>
            <div className="max-w-6xl mx-auot p-6">
                <h1 className="text-2xl font-bold mb-4">
                    Vendedor
                </h1>
                <div className="border rounded-md p-4 mb-6 shadow-sm bg-white">
                    <h2 className="text-lg font-semibold mb-2">
                        Perfil del vendedor
                    </h2>
                    <p className="font-thin"> Nombre: {seller.name}  </p>
                    <p className="font-thin"> Correo Electronico: {seller.email} </p>
                    <p className="font-thin"> Zona Asignada: {seller.assigned_area}  </p>
                    <p className="font-thin"> Metas de ventas total: {formatCurrency(seller.sales_goals_total || 0)}  </p>
                    <p className="font-thin"> Monto total logrado: {formatCurrency(seller.achieved_amount_total || 0)}  </p>
                </div>
                {salesPlans.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-4">
                        {salesPlans.map((plan, index) => (
                            <div key={index} className="border rounded-md p-4 shadow-sm bg-white">
                                <h3 className="font-semibold mb-1">{plan.name}</h3>
                                <p><strong>Inicio:</strong> {plan.start_date}</p>
                                <p><strong>Fin:</strong> {plan.end_date}</p>
                                <p><strong>Meta:</strong> {formatCurrency(plan.sales_goal)}</p>
                                <p><strong>Logrado:</strong> {formatCurrency(plan.achieved_amount)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ReportSalesPlan;