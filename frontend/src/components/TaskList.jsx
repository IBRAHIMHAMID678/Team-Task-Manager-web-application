import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TaskList = ({ team }) => {
  const [tasks, setTasks] = useState([]);
  const [filterAssignee, setFilterAssignee] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [newMemberId, setNewMemberId] = useState('');
  const [showMemberInput, setShowMemberInput] = useState(false);
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

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setStatus('Pending');
    setAssignedTo('');
    setDueDate('');
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setAssignedTo(task.assigned_to_details?.id || '');
    setDueDate(task.due_date || '');
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
        team: team.id,
        assigned_to: assignedTo || null,
        due_date: dueDate || null
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

  const updateTaskStatus = async (task, newStatus) => {
    try {
      await axios.patch(`/tasks/${task.id}/`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task', error);
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

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberId) return;
    try {
      await axios.post(`/teams/${team.id}/add_member/`, { user_id: newMemberId });
      setNewMemberId('');
      setShowMemberInput(false);
      alert('Member added successfully! Refresh to see changes.');
    } catch (error) {
      alert('Failed to add member or user not found.');
      console.error('Add member failed', error.response?.data);
    }
  };

  const isCreator = team.creator === user.id;

  const getStatusColor = (s) => {
    switch (s) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 ring-yellow-600/20';
      case 'In Progress': return 'bg-blue-100 text-blue-700 ring-blue-600/20';
      case 'Completed': return 'bg-green-100 text-green-700 ring-green-600/20';
      default: return 'bg-surface-100 text-surface-700 ring-surface-600/20';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)]">
      {/* Header Bar */}
      <div className="mb-6 flex flex-wrap gap-4 justify-between items-center bg-white p-5 rounded-2xl shadow-soft border border-surface-100 animate-[fadeIn_0.3s_ease-out]">
        <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:space-x-6">
          
          <div className="flex items-center space-x-2 bg-surface-50 p-1.5 rounded-xl border border-surface-200">
            <span className="text-xs font-bold text-surface-500 uppercase tracking-widest pl-3 pr-2">Members</span>
            <div className="flex -space-x-2">
              {team.members_details.slice(0, 5).map((m, i) => (
                <div key={m.id} className="w-8 h-8 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center font-bold text-xs ring-2 ring-white" title={m.username} style={{ zIndex: 10 - i }}>
                  {m.username.charAt(0).toUpperCase()}
                </div>
              ))}
              {team.members_details.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-surface-200 text-surface-700 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm z-0">
                  +{team.members_details.length - 5}
                </div>
              )}
            </div>
            {isCreator && (
              <div className="ml-2 relative">
                {!showMemberInput ? (
                  <button 
                    onClick={() => setShowMemberInput(true)} 
                    className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center hover:bg-brand-100 transition-colors border border-dashed border-brand-300"
                    title="Add Member"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                ) : (
                  <form onSubmit={handleAddMember} className="flex bg-white rounded-lg shadow-sm overflow-hidden border border-brand-200 animate-[fadeIn_0.2s_ease-out]">
                    <input
                      type="number"
                      placeholder="User ID"
                      value={newMemberId}
                      onChange={(e) => setNewMemberId(e.target.value)}
                      className="w-20 px-3 py-1.5 text-xs focus:outline-none placeholder-surface-300 text-surface-800"
                      autoFocus
                      onBlur={() => setTimeout(() => setShowMemberInput(false), 200)}
                    />
                    <button type="submit" className="px-3 bg-brand-50 text-brand-600 hover:bg-brand-100 text-xs font-medium border-l border-brand-100">
                      Add
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 ml-auto">
          <div className="flex flex-col relative w-48">
            <select 
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="appearance-none w-full pl-4 pr-10 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm font-medium text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
            >
              <option value="">Filter: All Members</option>
              {team.members_details.map(m => (
                <option key={m.id} value={m.id}>{m.username}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-surface-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          
          <button onClick={openCreateModal} className="btn-primary shadow-glow shadow-brand-400/30 flex items-center space-x-2 whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Task List - Kanban */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden min-h-0 pb-4">
        {['Pending', 'In Progress', 'Completed'].map((statusCol) => (
          <div key={statusCol} className="bg-surface-100/50 backdrop-blur-xl p-5 rounded-2xl flex flex-col min-h-0 border border-surface-200/50 shadow-sm relative">
            <div className="absolute top-0 inset-x-0 h-1 rounded-t-2xl opacity-50 bg-gradient-to-r from-transparent via-brand-400 to-transparent"></div>
            
            <div className="flex items-center justify-between mb-5 px-1">
              <h4 className="font-bold text-surface-800 tracking-tight flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full block
                  ${statusCol === 'Pending' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : ''}
                  ${statusCol === 'In Progress' ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' : ''}
                  ${statusCol === 'Completed' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : ''}
                `}></span>
                <span>{statusCol}</span>
              </h4>
              <span className="bg-white text-surface-500 font-bold text-xs px-2.5 py-0.5 rounded-full border border-surface-200 shadow-sm">
                {tasks.filter(t => t.status === statusCol).length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar px-1 pb-2">
              {tasks.filter(t => t.status === statusCol).map((task, index) => (
                <div 
                  key={task.id} 
                  className="bg-white p-5 rounded-2xl shadow-soft border border-surface-100 group hover:border-brand-200 hover:shadow-glow transition-all duration-300 animate-[fadeIn_0.4s_ease-out] relative"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold text-surface-900 leading-snug cursor-pointer group-hover:text-brand-700 transition-colors pr-6" onClick={() => openEditModal(task)}>
                      {task.title}
                    </h5>
                    
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex bg-white/90 backdrop-blur rounded-lg p-1 shadow-sm border border-surface-200">
                      <button onClick={() => openEditModal(task)} className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-md transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>

                  {task.description && <p className="text-sm text-surface-500 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>}
                  
                  {task.due_date && (
                    <div className="flex mb-4">
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-1 bg-surface-50 text-surface-600 rounded-md border border-surface-200">
                        <svg className="w-3.5 h-3.5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span>{new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3 pt-4 border-t border-surface-100">
                    <div className="flex items-center space-x-2">
                      {task.assigned_to_details ? (
                         <div className="flex items-center space-x-1.5" title={`Assigned to ${task.assigned_to_details.username}`}>
                           <div className="w-6 h-6 rounded-full bg-surface-200 text-surface-600 flex items-center justify-center font-bold text-[10px] ring-1 ring-surface-300">
                             {task.assigned_to_details.username.charAt(0).toUpperCase()}
                           </div>
                           <span className="text-xs font-medium text-surface-600 truncate max-w-[80px]">{task.assigned_to_details.username}</span>
                         </div>
                      ) : (
                        <span className="text-xs font-medium text-surface-400 bg-surface-50 border border-surface-200 px-2 py-0.5 rounded-md italic">Unassigned</span>
                      )}
                    </div>
                    
                    <div className="relative group">
                      <select 
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border-0 bg-transparent cursor-pointer ring-1 focus:ring-2 focus:ring-offset-1 focus:outline-none appearance-none pr-6 ${getStatusColor(task.status)} transition-all`}
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task, e.target.value)}
                      >
                        <option value="Pending" className="text-surface-800 bg-white">Pending</option>
                        <option value="In Progress" className="text-surface-800 bg-white">In Progress</option>
                        <option value="Completed" className="text-surface-800 bg-white">Completed</option>
                      </select>
                      <svg className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              ))}
              
              {tasks.filter(t => t.status === statusCol).length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-surface-200 rounded-2xl bg-surface-50/50">
                  <span className="text-sm font-medium text-surface-400">Empty List</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Backdrop & Container */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
          
          <div className="relative bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-lg overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="px-8 py-6 border-b border-surface-100 flex justify-between items-center bg-surface-50">
              <h3 className="text-xl font-bold text-surface-900 tracking-tight">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button onClick={closeModal} className="p-2 text-surface-400 hover:text-surface-700 hover:bg-white rounded-xl transition-all shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveTask} className="p-8 pb-10 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">Title</label>
                <input type="text" value={title} onChange={e=>setTitle(e.target.value)} required 
                  className="input-primary font-medium" placeholder="E.g. Redesign landing page" autoFocus/>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">Description</label>
                <textarea value={description} onChange={e=>setDescription(e.target.value)} rows="3"
                  className="input-primary resize-none placeholder-surface-300" placeholder="Add more details about this task..."></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-2">Status</label>
                  <select value={status} onChange={e=>setStatus(e.target.value)} 
                    className="input-primary text-surface-700 cursor-pointer">
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-2">Due Date</label>
                  <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)}
                    className="input-primary text-surface-700"/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">Assign to</label>
                <div className="relative">
                  <select value={assignedTo} onChange={e=>setAssignedTo(e.target.value)} 
                    className="input-primary bg-white cursor-pointer appearance-none">
                    <option value="">Unassigned</option>
                    {team.members_details.map(m => (
                      <option key={m.id} value={m.id}>{m.username}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-surface-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary shadow-glow shadow-brand-400/30">
                  {editingTask ? 'Save Changes' : 'Create Task'}
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
