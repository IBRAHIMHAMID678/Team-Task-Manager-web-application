import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamList = ({ activeTeam, setActiveTeam }) => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      await axios.post('/teams/', { name: newTeamName });
      setNewTeamName('');
      fetchTeams();
    } catch (error) {
      console.error('Error creating team', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-cardBg z-30">
      <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
        <h3 className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-4">Your Teams</h3>
        <ul className="space-y-1">
          {teams.length === 0 ? (
             <li className="text-sm text-textMuted italic bg-darkBg border border-borderColor p-4 rounded-xl text-center shadow-inner">
               No teams created yet.
             </li>
          ) : (
            teams.map(team => (
              <li key={team.id}>
                <button
                  onClick={() => setActiveTeam(team)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-200 group
                    ${activeTeam?.id === team.id 
                      ? 'bg-darkBg text-white border border-borderColor shadow-inner' 
                      : 'text-textMuted hover:bg-[#1C1E23] hover:text-white border border-transparent'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-2 h-2 rounded-full transition-colors duration-200 ${activeTeam?.id === team.id ? 'bg-brandLime shadow-glow cursor-default' : 'bg-borderColor group-hover:bg-textMuted'}`}></span>
                    <span className="truncate max-w-[150px] font-medium text-sm">{team.name}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${activeTeam?.id === team.id ? 'bg-[#2A2B2F] text-brandLime' : 'bg-darkBg text-textMutedDark group-hover:bg-[#2A2B2F]'}`}>
                    {team.members_details.length} Mem
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="p-5 bg-darkBg border-t border-borderColor shrink-0">
        <h3 className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-3">Create Team</h3>
        <form onSubmit={handleCreateTeam} className="relative">
          <input
            type="text"
            placeholder="Team name..."
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="input-auth pr-12 !py-2.5 !text-sm"
          />
          <button
            type="submit"
            disabled={loading || !newTeamName.trim()}
            className="absolute right-1 top-1 bottom-1 w-9 flex items-center justify-center bg-cardBg hover:bg-brandLime hover:text-black hover:border-brandLimeHover text-textMuted border border-borderColor rounded-md transition-all duration-200 shadow-sm disabled:opacity-50"
            title="Create"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamList;
