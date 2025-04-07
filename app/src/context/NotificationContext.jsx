import { createContext, useState, useContext } from 'react';
import { XMarkIcon } from "@heroicons/react/24/solid";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = (type, title, message) => {
        setNotification({ type, title, message });
        setTimeout(() => setNotification(null), 10000);
    };

    const handleClose = () => setNotification(null);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}

            {notification && (
                <div className="fixed bottom-10 right-5 z-50 w-full max-w-sm">
                    <div className="w-full rounded-lg shadow-lg border p-3 pt-2 bg-white flex items-start gap-3">
                        <div className="w-full flex justify-between">
                            <div className="flex flex-col justify-between items-start">
                                <div className="flex">
                                    <span className={`h-6 w-6 rounded-md mt-1 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <h3 className="pl-3 text-lg font-semibold text-gray-900">
                                        {notification.title}
                                    </h3>
                                </div>
                                <div className='pt-5'>
                                    <p className="text-gray-600">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <button onClick={handleClose}>
                                    <XMarkIcon className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};