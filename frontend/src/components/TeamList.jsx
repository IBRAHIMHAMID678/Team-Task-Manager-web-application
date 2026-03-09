import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamList = ({ activeTeam, setActiveTeam }) => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');

  const fetchTeams = async () => {
    try {
      const res = await axios.get('/teams/');
      setTeams(res.data);
    } catch (error) {
      console.error('Error fetching teams', error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    try {
      await axios.post('/teams/', { name: newTeamName });
      setNewTeamName('');
      fetchTeams();
    } catch (error) {
      console.error('Error creating team', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-4">
        <h2 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-4">Your Workspaces</h2>
        
        <div className="space-y-1">
          {teams.length === 0 ? (
            <p className="text-surface-400 text-sm italic bg-surface-50 p-3 rounded-xl border border-dashed border-surface-200">No workspaces yet. Create one below.</p>
          ) : (
            teams.map(team => (
              <button 
                key={team.id}
                onClick={() => setActiveTeam(team)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                  activeTeam?.id === team.id 
                    ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm border border-brand-100' 
                    : 'bg-transparent text-surface-600 hover:bg-surface-50 border border-transparent hover:border-surface-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${activeTeam?.id === team.id ? 'bg-brand-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]' : 'bg-surface-300 group-hover:bg-brand-300 transition-colors'}`}></div>
                  <span className="truncate max-w-[140px] text-sm">{team.name}</span>
                </div>
                <div className={`text-xs px-2 py-0.5 rounded-full ${activeTeam?.id === team.id ? 'bg-brand-100 text-brand-600' : 'bg-surface-100 text-surface-400 group-hover:bg-surface-200'}`}>
                  {team.members_details.length}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="mt-auto p-6 bg-surface-50/50 border-t border-surface-100">
        <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-3">Create Workspace</h3>
        <form onSubmit={handleCreateTeam} className="relative">
          <input
            type="text"
            placeholder="e.g. Design Team"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-white border border-surface-200 rounded-xl text-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={!newTeamName.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 p-1.5 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors disabled:opacity-50 disabled:bg-surface-100 disabled:text-surface-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamList;
