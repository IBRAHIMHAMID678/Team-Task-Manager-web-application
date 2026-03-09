import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TeamList from '../components/TeamList';
import TaskList from '../components/TaskList';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTeam, setActiveTeam] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Team Task Manager</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Welcome, {user.username}</span>
          <button 
            onClick={logout}
            className="text-sm px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r overflow-y-auto">
          <TeamList activeTeam={activeTeam} setActiveTeam={setActiveTeam} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {activeTeam ? (
            <TaskList team={activeTeam} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a team from the sidebar to view tasks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
