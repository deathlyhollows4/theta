import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="text-lg font-semibold text-cyan-300">
          AI DSA Copilot
        </Link>
        <nav className="flex gap-4 text-sm text-slate-300">
          <Link to="/dashboard" className="hover:text-cyan-300">
            Dashboard
          </Link>
          <Link to="/problems" className="hover:text-cyan-300">
            Problem Bank
          </Link>
          <Link to="/login" className="hover:text-cyan-300">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
