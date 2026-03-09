import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TaskList = ({ team }) => {
  const [tasks, setTasks] = useState([]);
  const [filterAssignee, setFilterAssignee] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const { user } = useContext(AuthContext);

  const fetchTasks = async () => {
    let url = `/tasks/?team=${team.id}`;
    if (filterAssignee) url += `&assigned_to=${filterAssignee}`;
    try {
      const res = await axios.get(url);
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [team.id, filterAssignee]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/tasks/', {
        title,
        description,
        status,
        team: team.id,
        assigned_to: assignedTo || null,
        due_date: dueDate || null
      });
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  const updateTaskStatus = async (task, newStatus) => {
    try {
      await axios.patch(`/tasks/${task.id}/`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberId) return;
    try {
      await axios.post(`/teams/${team.id}/add_member/`, { user_id: newMemberId });
      setNewMemberId('');
      alert('Member added, please refresh team list.');
    } catch (error) {
      alert('Failed to add member or user not found.');
    }
  };

  const isCreator = team.creator === user.id;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex justify-between items-end bg-white p-6 shadow-sm rounded-lg border">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{team.name}</h2>
          <div className="flex space-x-2 text-sm text-gray-600 mb-4">
            <span className="font-semibold text-gray-700">Members:</span>
            {team.members_details.map(m => (
              <span key={m.id} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{m.username}</span>
            ))}
          </div>
          {isCreator && (
            <form onSubmit={handleAddMember} className="flex space-x-2">
              <input
                type="number"
                placeholder="User ID"
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
                className="w-24 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border-gray-300"
              />
              <button type="submit" className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                Add Member
              </button>
            </form>
          )}
        </div>
        
        <div className="flex flex-col space-y-2 w-64">
          <label className="text-xs text-gray-500 font-semibold uppercase">Filter by Assignee</label>
          <select 
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
          >
            <option value="">All Members</option>
            {team.members_details.map(m => (
              <option key={m.id} value={m.id}>{m.username}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex space-x-6 flex-1 overflow-hidden">
        {/* Task Creation Form */}
        <div className="w-80 bg-white p-6 rounded-lg shadow-sm border overflow-y-auto h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Create New Task</h3>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={title} onChange={e=>setTitle(e.target.value)} required 
                className="w-full px-3 py-2 border rounded focus:ring-blue-500 border-gray-300 text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={description} onChange={e=>setDescription(e.target.value)} rows="3"
                className="w-full px-3 py-2 border rounded focus:ring-blue-500 border-gray-300 text-sm"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={status} onChange={e=>setStatus(e.target.value)} 
                className="w-full px-3 py-2 border rounded focus:ring-blue-500 border-gray-300 text-sm">
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select value={assignedTo} onChange={e=>setAssignedTo(e.target.value)} 
                className="w-full px-3 py-2 border rounded focus:ring-blue-500 border-gray-300 text-sm">
                <option value="">Unassigned</option>
                {team.members_details.map(m => (
                  <option key={m.id} value={m.id}>{m.username}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-blue-500 border-gray-300 text-sm"/>
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">
              Create Task
            </button>
          </form>
        </div>

        {/* Task List - Simple Kanban */}
        <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
          {['Pending', 'In Progress', 'Completed'].map(statusCol => (
            <div key={statusCol} className="bg-gray-100 p-4 rounded-lg flex flex-col h-full border border-gray-200">
              <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm tracking-wide">{statusCol}</h4>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {tasks.filter(t => t.status === statusCol).map(task => (
                  <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 group">
                    <h5 className="font-bold text-gray-800 leading-tight mb-1">{task.title}</h5>
                    {task.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>}
                    
                    <div className="flex justify-between items-center text-xs mt-3 pt-3 border-t border-gray-100">
                      <div className="text-gray-500">
                        {task.assigned_to_details ? `👤 ${task.assigned_to_details.username}` : 'Unassigned'}
                      </div>
                      <select 
                        className="text-xs bg-transparent border-gray-300 rounded focus:ring-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task, e.target.value)}
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
                {tasks.filter(t => t.status === statusCol).length === 0 && (
                  <div className="text-sm text-gray-400 italic text-center py-4">No tasks</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
