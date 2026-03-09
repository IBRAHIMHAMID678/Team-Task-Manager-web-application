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
  const [reminders, setReminders] = useState([]);
  const [showReminders, setShowReminders] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      // Fetch total task count
      axios.get('/tasks/').then(res => setAllTasksCount(res.data.length)).catch(() => {});
      // Fetch due-date reminders
      axios.get('/tasks/reminders/').then(res => {
        if (res.data.count > 0) setReminders(res.data.reminders);
      }).catch(() => {});
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-darkBg font-sans overflow-hidden text-white relative flex-col">
      {/* Top Navbar */}
      <header className="h-[72px] flex items-center px-6 justify-between border-b border-borderColor bg-[#121315] shrink-0">
        <div className="flex items-center space-x-5">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-textMuted hover:text-white transition-colors"
            aria-label="Toggle team sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
              {activeTeam ? activeTeam.name : 'All Teams'}
            </h1>
            <p className="text-xs text-textMuted">
              {activeTeam
                ? `${activeTeam.members_details?.length ?? 0} members`
                : `${allTasksCount} task${allTasksCount !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-textMuted hidden md:block">
            Signed in as <span className="text-white font-semibold">{user.username}</span>
          </span>
          <button
            onClick={logout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-borderColor text-textMuted hover:text-white hover:border-textMuted transition-all text-xs font-semibold"
            title="Sign out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign out</span>
          </button>
        </div>
      </header>

      {/* Due-date Reminder Banner */}
      {reminders.length > 0 && showReminders && (
        <div className="shrink-0 bg-[#1C1A0F] border-b border-priorityMedium/30 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-priorityMedium text-lg">⏰</span>
            <div>
              <p className="text-xs font-bold text-priorityMedium uppercase tracking-widest">Upcoming Due Dates</p>
              <p className="text-sm text-white">
                You have{' '}
                <span className="font-bold text-priorityMedium">{reminders.length}</span>{' '}
                task{reminders.length > 1 ? 's' : ''} due within 3 days:{' '}
                <span className="text-textMuted">{reminders.map(r => r.title).join(', ')}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowReminders(false)}
            className="text-textMuted hover:text-white transition-colors ml-4"
            aria-label="Dismiss reminders"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 bg-black/60 z-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sliding Sidebar */}
        <div className={`absolute left-0 top-0 bottom-0 w-72 bg-cardBg z-30 transform transition-transform duration-300 ease-in-out border-r border-borderColor flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-5 border-b border-borderColor flex justify-between items-center shrink-0">
            <h2 className="text-base font-bold text-white">Workspaces</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-textMuted hover:text-white">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="p-3 border-b border-borderColor shrink-0">
            <button
              onClick={() => { setActiveTeam(null); setIsSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2 text-sm transition-all
                ${!activeTeam ? 'bg-borderColor text-white font-semibold' : 'text-textMuted hover:bg-darkBg hover:text-white'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
              </svg>
              <span>All Teams</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <TeamList
              activeTeam={activeTeam}
              setActiveTeam={(team) => { setActiveTeam(team); setIsSidebarOpen(false); }}
            />
          </div>
        </div>

        {/* Task Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
          <TaskList team={activeTeam} onTaskCountChange={setAllTasksCount} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
