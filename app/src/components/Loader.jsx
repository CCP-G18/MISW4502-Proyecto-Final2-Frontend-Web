const Loader = ({ text = 'Cargando...' }) => {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm">{text}</p>
      </div>
    );
};
  
  export default Loader;