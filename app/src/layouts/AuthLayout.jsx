import React from 'react';
import { Outlet } from "react-router";
import Footer from '../components/Footer';

const AuthLayout = () => {
  return (
    <>
        <header className="w-full bg-[#033649] text-white p-4 text-center text-4xl font-bold">
            <h1>CCP</h1>
        </header>
        <main className='flex-grow flex justify-center items-center'>
            <Outlet />
        </main>
        <Footer />
    </>
  );
};

export default AuthLayout;