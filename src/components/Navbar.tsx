import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

function Navbar() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <div className="space-x-4 flex items-center">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-blue-500' : 'hover:text-blue-500')}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'text-blue-500' : 'hover:text-blue-500')}>
            About
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? 'text-blue-500' : 'hover:text-blue-500')}>
            Projects
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'text-blue-500' : 'hover:text-blue-500')}>
            Contact
          </NavLink>
          <NavLink to="/game" className={({ isActive }) => (isActive ? 'text-blue-500' : 'hover:text-blue-500')}>
            Code Match
          </NavLink>
          <NavLink to="/ping-pong" className={({ isActive }) => (isActive ? 'text-blue-500' : 'hover:text-blue-500')}>
            Ping Pong
          </NavLink>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;