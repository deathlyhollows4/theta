import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="text-lg font-semibold text-cyan-300">
          AI DSA Copilot
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          {isAuthenticated && (
            <>
              <span className="text-slate-400">@{user?.username}</span>
              <Link to="/dashboard" className="hover:text-cyan-300">
                Dashboard
              </Link>
              <Link to="/problems" className="hover:text-cyan-300">
                Problem Bank
              </Link>
              <button onClick={onLogout} className="rounded border border-slate-700 px-2 py-1 hover:border-cyan-500 hover:text-cyan-300">
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/login" className="hover:text-cyan-300">
                Login
              </Link>
              <Link to="/register" className="hover:text-cyan-300">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
