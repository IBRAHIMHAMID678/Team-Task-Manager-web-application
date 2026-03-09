import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
    <div className="flex h-screen bg-surface-50 font-sans overflow-hidden">
      {/* Sidebar for Teams */}
      <div className="w-80 bg-white border-r border-surface-200 shadow-soft flex flex-col z-20 transition-all duration-300">
        <div className="p-6 border-b border-surface-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex justify-center items-center shadow-glow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold text-surface-900 tracking-tight">Focus</h1>
          </div>
        </div>
        
        {/* User Profile Area */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-surface-100 bg-surface-50 mx-4 mt-6 mb-2 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm border border-brand-200">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-surface-800 leading-tight">{user.username}</p>
              <p className="text-xs text-surface-500">Workspace Member</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="text-surface-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
            title="Sign out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          <TeamList activeTeam={activeTeam} setActiveTeam={setActiveTeam} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-surface-50 relative">
        {/* Top Navbar */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-surface-200 shadow-sm flex items-center px-8 justify-between z-10 sticky top-0">
          <div className="flex items-center">
            {activeTeam ? (
              <div className="flex gap-2 flex-col justify-center h-full">
                <h2 className="text-2xl font-bold tracking-tight text-surface-900 leading-tight">{activeTeam.name}</h2>
                <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-surface-400 mt-1 space-x-2">
                  <span>{activeTeam.members_details.length} workspace members</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1 justify-center h-full">
                <h2 className="text-2xl font-bold tracking-tight text-surface-900 leading-tight">Dashboard Overview</h2>
                <p className="text-sm font-medium text-surface-500">A high-level view of your productivity space.</p>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=')] opacity-60 z-0 pointer-events-none"></div>

          <div className="relative z-10 h-full flex flex-col">
            {activeTeam ? (
              <TaskList team={activeTeam} />
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-14rem)] text-center animate-[fadeIn_0.5s_ease-out]">
                <div className="w-24 h-24 mb-6 rounded-full bg-surface-100 flex items-center justify-center flex-shrink-0 animate-bounce cursor-default border-4 border-white shadow-soft">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-surface-800 mb-2">Create or select a workspace</h3>
                <p className="text-surface-500 max-w-sm mx-auto leading-relaxed text-sm">
                  Start mapping out your team's success by selecting an existing workspace from the sidebar or creating a new one to collaborate on projects.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
