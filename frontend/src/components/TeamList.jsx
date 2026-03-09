import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamList = ({ activeTeam, setActiveTeam }) => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [creating, setCreating] = useState(false);

  // Invite state
  const [inviteTeamId, setInviteTeamId] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMsg, setInviteMsg] = useState('');
  const [inviting, setInviting] = useState(false);

  const fetchTeams = async () => {
    try {
      const res = await axios.get('/teams/');
      setTeams(res.data);
    } catch (err) {
      console.error('Error fetching teams', err);
    }
  };

  useEffect(() => { fetchTeams(); }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setCreating(true);
    try {
      await axios.post('/teams/', { name: newTeamName.trim() });
      setNewTeamName('');
      fetchTeams();
    } catch (err) {
      console.error('Error creating team', err);
    } finally {
      setCreating(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    setInviteMsg('');
    try {
      const res = await axios.post(`/teams/${inviteTeamId}/invite/`, { email: inviteEmail });
      setInviteMsg(res.data.message);
      setInviteEmail('');
      fetchTeams(); // refresh in case user was added
    } catch (err) {
      setInviteMsg(err.response?.data?.error || 'Invite failed.');
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-cardBg">
      {/* Teams list */}
      <div className="p-4 flex-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-3">Your Teams</p>
        {teams.length === 0 ? (
          <p className="text-sm text-textMuted italic text-center py-6">No teams yet.</p>
        ) : (
          <ul className="space-y-1">
            {teams.map(team => (
              <li key={team.id}>
                <button
                  onClick={() => setActiveTeam(team)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all duration-150 group
                    ${activeTeam?.id === team.id
                      ? 'bg-darkBg text-white border border-borderColor'
                      : 'text-textMuted hover:bg-[#1C1E23] hover:text-white border border-transparent'}`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${activeTeam?.id === team.id ? 'bg-brandLime' : 'bg-borderColor group-hover:bg-textMuted'}`} />
                    <span className="text-sm font-medium truncate max-w-[130px]">{team.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-textMutedDark px-1.5 py-0.5 rounded bg-darkBg">
                    {team.members_details?.length ?? 0}
                  </span>
                </button>

                {/* Invite section for active team */}
                {activeTeam?.id === team.id && (
                  <div className="mx-2 mt-1 mb-2 p-3 rounded-lg bg-darkBg border border-borderColor">
                    <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-2">Invite via Email</p>
                    <form onSubmit={handleInvite} className="space-y-2">
                      <input
                        type="email"
                        placeholder="member@email.com"
                        value={inviteEmail}
                        onChange={e => { setInviteTeamId(team.id); setInviteEmail(e.target.value); setInviteMsg(''); }}
                        className="input-auth !py-2 !text-xs"
                        required
                      />
                      <button
                        type="submit"
                        disabled={inviting}
                        className="w-full py-2 rounded-lg text-xs font-bold bg-brandLime text-black hover:bg-brandLimeHover transition-colors disabled:opacity-50"
                      >
                        {inviting ? 'Sending…' : 'Send Invite'}
                      </button>
                    </form>
                    {inviteMsg && (
                      <p className="text-[11px] text-textMuted mt-2 leading-snug">{inviteMsg}</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Create Team form */}
      <div className="p-4 bg-darkBg border-t border-borderColor shrink-0">
        <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-2">New Team</p>
        <form onSubmit={handleCreateTeam} className="relative">
          <input
            type="text"
            placeholder="Team name…"
            value={newTeamName}
            onChange={e => setNewTeamName(e.target.value)}
            className="input-auth pr-12 !py-2.5 !text-sm"
          />
          <button
            type="submit"
            disabled={creating || !newTeamName.trim()}
            className="absolute right-1 top-1 bottom-1 w-9 flex items-center justify-center bg-cardBg hover:bg-brandLime hover:text-black text-textMuted border border-borderColor rounded-md transition-all disabled:opacity-40"
          >
            {creating
              ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamList;
