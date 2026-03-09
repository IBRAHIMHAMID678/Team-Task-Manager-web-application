import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TaskList = ({ team }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [assignedTo, setAssignedTo] = useState('');
  
  const { user } = useContext(AuthContext);

  const fetchTasks = async () => {
    let url = `/tasks/`;
    if (team) {
      url += `?team=${team.id}`;
    }
    // We fetch everything and filter frontend for search/status
    try {
      const res = await axios.get(url);
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [team]);

  useEffect(() => {
    let filtered = tasks;
    if(searchQuery) {
      filtered = filtered.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if(filterStatus) {
      filtered = filtered.filter(t => t.status === filterStatus);
    }
    if(filterAssignee) {
      filtered = filtered.filter(t => t.assigned_to === parseInt(filterAssignee));
    }
    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filterStatus, filterAssignee]);

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    done: tasks.filter(t => t.status === 'Completed').length,
  };

  const openCreateModal = () => {
    if(!team) {
      alert("Please select a team first to create a task.");
      return;
    }
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setStatus('Pending');
    setAssignedTo('');
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setAssignedTo(task.assigned_to || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        status,
        team: editingTask ? editingTask.team.id : team.id,
        assigned_to: assignedTo || null,
      };

      if (editingTask) {
        await axios.patch(`/tasks/${editingTask.id}/`, payload);
      } else {
        await axios.post('/tasks/', payload);
      }
      closeModal();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task', error);
    }
  };

  const deleteTask = async (taskId) => {
    if(!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`/tasks/${taskId}/`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  // Unique assignees for the filter dropdown
  const assignees = Array.from(new Set(tasks.map(t => t.assigned_to_details?.id).filter(Boolean)))
    .map(id => tasks.find(t => t.assigned_to_details?.id === id).assigned_to_details);

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-full bg-darkBg text-white pb-24">
      {/* Stats Cards Matching Image 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="dash-card flex flex-col justify-between h-32">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span className="text-xs font-bold text-textMuted uppercase tracking-widest">TOTAL</span>
          </div>
          <div className="text-4xl font-extrabold text-white mt-auto">{stats.total}</div>
        </div>

        <div className="dash-card flex flex-col justify-between h-32">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-textMuted"></span>
            <span className="text-xs font-bold text-textMuted uppercase tracking-widest">TO DO</span>
          </div>
          <div className="text-4xl font-extrabold text-white mt-auto">{stats.todo}</div>
        </div>

        <div className="dash-card flex flex-col justify-between h-32 ring-1 ring-brandLime/30">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-statusProgress"></span>
            <span className="text-xs font-bold text-textMuted uppercase tracking-widest text-[#00E1D9]">IN PROGRESS</span>
          </div>
          <div className="text-4xl font-extrabold text-white mt-auto">{stats.inProgress}</div>
        </div>

        <div className="dash-card flex flex-col justify-between h-32">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-brandLime"></span>
            <span className="text-xs font-bold text-textMuted uppercase tracking-widest text-brandLime">DONE</span>
          </div>
          <div className="text-4xl font-extrabold text-white mt-auto">{stats.done}</div>
        </div>
      </div>

      {/* Filters and Actions Bar Matching Image 2 */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <div className="relative flex-1 w-full flex items-center bg-cardBg border border-borderColor rounded-lg overflow-hidden group focus-within:ring-1 focus-within:ring-brandLime transition-all">
          <svg className="w-5 h-5 text-textMuted ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-textMuted focus:outline-none"
          />
        </div>

        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-cardBg border border-borderColor text-white text-sm rounded-lg px-4 py-3 focus:outline-none appearance-none cursor-pointer min-w-[140px]"
        >
          <option value="">All Status</option>
          <option value="Pending">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Done</option>
        </select>

        <select 
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
          className="bg-cardBg border border-borderColor text-white text-sm rounded-lg px-4 py-3 focus:outline-none appearance-none cursor-pointer min-w-[140px]"
        >
          <option value="">All Assignees</option>
          {assignees.map(m => (
            <option key={m.id} value={m.id}>{m.username}</option>
          ))}
        </select>

        <button onClick={openCreateModal} className="btn-new-task h-full py-3 ml-auto">
          <span className="mr-1 text-lg leading-none">+</span> NEW TASK
        </button>
      </div>

      {/* Task Grid Matching Image 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full py-12 text-center text-textMuted">No tasks found.</div>
        ) : (
          filteredTasks.map(task => {
            const isTodo = task.status === 'Pending';
            const isProgress = task.status === 'In Progress';
            const isDone = task.status === 'Completed';

            return (
              <div key={task.id} className="task-card group relative" onClick={() => openEditModal(task)}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    {isTodo && <span className="w-4 h-4 rounded-full border-2 border-textMuted flex items-center justify-center"></span>}
                    {isProgress && <span className="text-[#00E1D9]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>}
                    {isDone && <span className="text-brandLime"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>}
                    
                    <span className={`text-xs font-bold uppercase tracking-widest ${isTodo ? 'text-textMuted' : isProgress ? 'text-[#00E1D9]' : 'text-brandLime'}`}>
                      {isTodo ? 'TO DO' : isProgress ? 'IN PROGRESS' : 'DONE'}
                    </span>
                  </div>
                  
                  {/* Fake Priority Indicator matching screenshot */}
                  {task.id % 3 === 0 ? (
                    <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-[#F97316]/10 text-priorityHigh text-xs font-bold">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14h2"></path></svg>
                      <span>High</span>
                    </div>
                  ) : task.id % 2 === 0 ? (
                     <div className="flex items-center space-x-1 px-2 py-1 rounded bg-priorityMedium/10 text-priorityMedium text-xs font-bold">
                       <span className="text-lg leading-none">-</span>
                       <span>Medium</span>
                     </div>
                  ) : (
                     <div className="flex items-center space-x-1 px-2 py-1 rounded bg-textMuted/10 text-textMuted text-xs font-bold">
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                       <span>Low</span>
                     </div>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="text-[17px] font-bold text-white mb-1.5 leading-snug">{task.title}</h3>
                  <p className="text-[13px] text-textMuted line-clamp-1">{task.description}</p>
                </div>

                <div className="mt-auto flex justify-between items-center">
                  {/* Fake Tag matching screenshot */}
                  <span className="px-3 py-1 bg-cardBg border border-borderColor rounded-full text-[11px] text-textMuted font-medium">
                    {task.id % 2 === 0 ? 'Engineering' : 'Marketing'}
                  </span>

                  {task.assigned_to_details && (
                    <div className="flex items-center space-x-2">
                       <span className="text-xs font-bold text-textMuted tracking-wider">
                         {task.assigned_to_details.username.substring(0, 2).toUpperCase()}
                       </span>
                       <span className="text-[13px] text-textMuted">
                         {task.assigned_to_details.username}
                       </span>
                    </div>
                  )}
                </div>

                {/* Delete button (shows on hover) */}
                <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-red-500 shadow-md z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Modal matching theme */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-cardBg border border-borderColor rounded-xl shadow-2xl w-full max-w-lg p-8 relative">
            <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h3>
            
            <form onSubmit={handleSaveTask} className="space-y-5">
              <div>
                <label className="input-auth-label">Title</label>
                <input type="text" value={title} onChange={e=>setTitle(e.target.value)} required 
                  className="input-auth" placeholder="Task title" autoFocus/>
              </div>
              
              <div>
                <label className="input-auth-label">Description</label>
                <textarea value={description} onChange={e=>setDescription(e.target.value)} rows="3"
                  className="input-auth resize-none" placeholder="Task description..."></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="input-auth-label">Status</label>
                  <select value={status} onChange={e=>setStatus(e.target.value)} 
                    className="input-auth cursor-pointer appearance-none px-4">
                    <option value="Pending">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Done</option>
                  </select>
                </div>
                <div>
                  <label className="input-auth-label">Assignee</label>
                  {team ? (
                    <select value={assignedTo} onChange={e=>setAssignedTo(e.target.value)} 
                      className="input-auth cursor-pointer appearance-none px-4">
                      <option value="">Unassigned</option>
                      {team.members_details.map(m => (
                        <option key={m.id} value={m.id}>{m.username}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="input-auth flex items-center text-textMuted bg-darkBg opacity-70">
                      Needs Team Select
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 flex space-x-4">
                <button type="button" onClick={closeModal} className="flex-1 py-3 bg-darkBg text-white border border-borderColor rounded-lg font-bold text-sm tracking-wide hover:bg-[#1A1C20] transition-colors">
                  CANCEL
                </button>
                <button type="submit" className="flex-1 btn-auth">
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
