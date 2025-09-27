
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <header className="bg-white shadow-md mb-8">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Smart Feedback Tracker</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            Welcome, <span className="font-semibold">{currentUser.name}</span> ({currentUser.role})
          </span>
          <button
            onClick={onLogout}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
