import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const Logout = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        logout();
        navigate("/login");
    }, [logout, navigate]);
};
  
export default Logout;