
import React, { useState } from 'react';
import { User, UserRole } from './types';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import Header from './components/Header';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {currentUser.role === UserRole.ADMIN ? (
          <AdminDashboard currentUser={currentUser} />
        ) : (
          <EmployeeDashboard currentUser={currentUser} />
        )}
      </main>
    </div>
  );
};

export default App;
