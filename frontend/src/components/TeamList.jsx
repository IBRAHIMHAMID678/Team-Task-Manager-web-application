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
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Your Teams</h2>
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {teams.length === 0 ? (
          <p className="text-gray-500 text-sm">No teams found.</p>
        ) : (
          teams.map(team => (
            <div 
              key={team.id}
              onClick={() => setActiveTeam(team)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                activeTeam?.id === team.id ? 'bg-blue-100 text-blue-800 font-medium border border-blue-200' : 'bg-white hover:bg-gray-100 text-gray-700 border border-transparent'
              }`}
            >
              {team.name}
              <div className="text-xs text-gray-500 mt-1">{team.members_details.length} members</div>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto border-t pt-4">
        <form onSubmit={handleCreateTeam} className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="New Team Name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Create Team
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamList;
