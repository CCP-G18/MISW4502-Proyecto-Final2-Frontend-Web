import React from 'react';
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <>
        <header className="w-full bg-[#033649] text-white p-4 text-center text-4xl font-bold">
            <h1>CCP</h1>
        </header>
        <main className='flex-grow flex justify-center items-center'>
            <Outlet />
        </main>
        <footer className="w-full border-t">
            <div className="flex flex-col justify-center text-center m-2 sm:flex-row sm:justify-between sm:mx-4">
                <p><span className='font-bold'>Copyright CCP</span> © 2025</p>
                <p>Sitio web logístico</p>
            </div>
        </footer>
    </>
  );
};

export default AuthLayout;