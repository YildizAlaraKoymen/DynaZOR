import { useNavigate } from 'react-router-dom';

export default function Navbar({userID}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all session data to ensure clean logout
    localStorage.clear();
    navigate('/home');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-white font-bold text-2xl tracking-tight">DynaZOR</h1>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => navigate('/schedule', { state: { userID: userID } })}
              className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out hover:bg-indigo-500"
            >
              Schedule
            </button>
            <button
              onClick={() => navigate('/dashboard', { state: { userID: userID } })}
              className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out hover:bg-indigo-500"
            >
              Dashboard
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}