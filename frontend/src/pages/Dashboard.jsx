import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TeamList from '../components/TeamList';
import TaskList from '../components/TaskList';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTeam, setActiveTeam] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allTasksCount, setAllTasksCount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Just a rough fetch to get total tasks count if needed
    if(user) {
      axios.get('/tasks/').then(res => setAllTasksCount(res.data.length)).catch(console.error);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-darkBg font-sans overflow-hidden text-white relative flex-col">
      {/* Top Navbar matching Image 2 */}
      <header className="h-[88px] flex items-center px-6 justify-between border-b border-borderColor bg-[#121315]">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-textMuted hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
              {activeTeam ? activeTeam.name : 'All Teams'}
            </h1>
            <p className="text-sm text-textMuted mt-0.5">
              {activeTeam ? `${activeTeam.members_details.length} members` : `${allTasksCount} tasks`}
            </p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="p-2 text-textMuted hover:text-white transition-colors"
          title="Sign out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="absolute inset-0 bg-black/50 z-20 transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        {/* Sidebar for Teams */}
        <div className={`absolute left-0 top-0 bottom-0 w-80 bg-cardBg z-30 transform transition-transform duration-300 ease-in-out border-r border-borderColor ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-borderColor flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Workspaces</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-textMuted hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
          
          <div className="p-4 border-b border-borderColor">
            <button
               onClick={() => { setActiveTeam(null); setIsSidebarOpen(false); }}
               className={`w-full text-left px-4 py-3 rounded-lg flex items-center mb-2 ${!activeTeam ? 'bg-borderColor text-white' : 'text-textMuted hover:bg-darkBg hover:text-white'}`}
            >
              All Teams (Overview)
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TeamList activeTeam={activeTeam} setActiveTeam={(team) => { setActiveTeam(team); setIsSidebarOpen(false); }} />
          </div>
        </div>

        {/* Task List Component handles the rest of the layout */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto relative w-full">
          <TaskList team={activeTeam} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
