import React from 'react';
import { Outlet } from "react-router";
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <>
        <section id='menu-ccp' className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Topbar />
                <main className='flex-grow flex justify-center items-center p-2 bg-gray-300'>
                    <div className='w-full h-full p-4 border rounded-sm bg-gray-100'>
                        <Outlet />
                    </div>
                </main>
                <Footer />
            </div>
        </section>
    </>
  );
};

export default MainLayout;