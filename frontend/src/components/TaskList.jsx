import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Priority badge configs
const PRIORITY_CONFIG = {
  High:   { bg: 'bg-priorityHigh/10',   text: 'text-priorityHigh',   icon: '🔥', label: 'High' },
  Medium: { bg: 'bg-priorityMedium/10', text: 'text-priorityMedium', icon: '—',  label: 'Medium' },
  Low:    { bg: 'bg-textMuted/10',       text: 'text-textMuted',      icon: '↓',  label: 'Low' },
};

const StatusIcon = ({ status }) => {
  if (status === 'In Progress')
    return <span className="text-[#00E1D9]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></span>;
  if (status === 'Completed')
    return <span className="text-brandLime"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></span>;
  return <span className="w-4 h-4 rounded-full border-2 border-textMuted block"></span>;
};

const StatusLabel = ({ status }) => {
  const map = { Pending: 'TO DO', 'In Progress': 'IN PROGRESS', Completed: 'DONE' };
  const colour = { Pending: 'text-textMuted', 'In Progress': 'text-[#00E1D9]', Completed: 'text-brandLime' };
  return <span className={`text-[10px] font-bold uppercase tracking-widest ${colour[status]}`}>{map[status] || status}</span>;
};

const TaskList = ({ team }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'Pending', priority: 'Medium', assigned_to: '', due_date: '' });

  const { user } = useContext(AuthContext);

  const fetchTasks = async () => {
    try {
      const url = team ? `/tasks/?team=${team.id}` : '/tasks/';
      const res = await axios.get(url);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  useEffect(() => { fetchTasks(); }, [team]);

  useEffect(() => {
    let f = tasks;
    if (searchQuery) f = f.filter(t => (t.title + ' ' + t.description).toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterStatus)  f = f.filter(t => t.status === filterStatus);
    if (filterAssignee) f = f.filter(t => String(t.assigned_to) === filterAssignee);
    setFilteredTasks(f);
  }, [tasks, searchQuery, filterStatus, filterAssignee]);

  const stats = {
    total:      tasks.length,
    todo:       tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    done:       tasks.filter(t => t.status === 'Completed').length,
  };

  const openCreateModal = () => {
    if (!team) { alert('Please select a team first to create a task.'); return; }
    setEditingTask(null);
    setForm({ title: '', description: '', status: 'Pending', priority: 'Medium', assigned_to: '', due_date: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setForm({
      title:      task.title,
      description: task.description,
      status:     task.status,
      priority:   task.priority || 'Medium',
      assigned_to: task.assigned_to ? String(task.assigned_to) : '',
      due_date:   task.due_date || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title:       form.title,
        description: form.description,
        status:      form.status,
        priority:    form.priority,
        team:        editingTask ? editingTask.team.id : team.id,
        assigned_to: form.assigned_to || null,
        due_date:    form.due_date || null,
      };
      if (editingTask) {
        await axios.patch(`/tasks/${editingTask.id}/`, payload);
      } else {
        await axios.post('/tasks/', payload);
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      console.error('Error saving task', err.response?.data || err);
    }
  };

  const deleteTask = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this task?')) return;
    try { await axios.delete(`/tasks/${id}/`); fetchTasks(); }
    catch (err) { console.error('Error deleting task', err); }
  };

  const assignees = Array.from(
    new Map(tasks.filter(t => t.assigned_to_details).map(t => [t.assigned_to_details.id, t.assigned_to_details]))
  ).map(([, v]) => v);

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col min-h-full bg-darkBg text-white">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { label: 'TOTAL',       value: stats.total,      dot: 'bg-white' },
          { label: 'TO DO',       value: stats.todo,       dot: 'bg-textMuted' },
          { label: 'IN PROGRESS', value: stats.inProgress, dot: 'bg-[#00E1D9]', ring: 'ring-1 ring-brandLime/30', textColor: 'text-[#00E1D9]' },
          { label: 'DONE',        value: stats.done,       dot: 'bg-brandLime',  textColor: 'text-brandLime' },
        ].map(({ label, value, dot, ring = '', textColor = 'text-textMuted' }) => (
          <div key={label} className={`dash-card flex flex-col justify-between h-32 ${ring}`}>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${dot}`}></span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${textColor}`}>{label}</span>
            </div>
            <div className="text-4xl font-extrabold text-white">{value}</div>
          </div>
        ))}
      </div>

      {/* Filter / Action Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-8 items-center">
        <div className="relative flex-1 w-full flex items-center bg-cardBg border border-borderColor rounded-lg focus-within:ring-1 focus-within:ring-brandLime transition-all overflow-hidden">
          <svg className="w-4 h-4 text-textMuted ml-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-textMuted focus:outline-none" />
        </div>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-cardBg border border-borderColor text-white text-sm rounded-lg px-4 py-3 focus:outline-none appearance-none cursor-pointer min-w-[140px]">
          <option value="">All Status</option>
          <option value="Pending">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Done</option>
        </select>

        <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}
          className="bg-cardBg border border-borderColor text-white text-sm rounded-lg px-4 py-3 focus:outline-none appearance-none cursor-pointer min-w-[140px]">
          <option value="">All Assignees</option>
          {assignees.map(m => <option key={m.id} value={String(m.id)}>{m.username}</option>)}
        </select>

        <button onClick={openCreateModal} className="btn-new-task h-full py-3 ml-auto whitespace-nowrap">
          <span className="mr-1 text-lg leading-none">+</span> NEW TASK
        </button>
      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="py-20 text-center text-textMuted text-sm">
          {team ? 'No tasks yet — create your first task!' : 'Select a team or create tasks to get started.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-12">
          {filteredTasks.map(task => {
            const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium;
            return (
              <div key={task.id} className="task-card group relative" onClick={() => openEditModal(task)}>
                {/* Top row – status + priority */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <StatusIcon status={task.status} />
                    <StatusLabel status={task.status} />
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded ${p.bg} ${p.text} text-[11px] font-bold`}>
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </div>
                </div>

                {/* Title + description */}
                <div className="mb-3">
                  <h3 className="text-[16px] font-bold text-white mb-1 leading-snug">{task.title}</h3>
                  <p className="text-[12px] text-textMuted line-clamp-1">{task.description}</p>
                </div>

                {/* Bottom row – team tag + assignee */}
                <div className="mt-auto flex justify-between items-center">
                  <span className="px-3 py-1 bg-darkBg border border-borderColor rounded-full text-[11px] text-textMuted font-medium">
                    {task.team_details?.name || team?.name || '—'}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {task.due_date && <span className="text-[10px] text-textMutedDark">{task.due_date}</span>}
                    {task.assigned_to_details && (
                      <>
                        <span className="text-[11px] font-bold text-textMuted">
                          {task.assigned_to_details.username.substring(0, 2).toUpperCase()}
                        </span>
                        <span className="text-[13px] text-textMuted">{task.assigned_to_details.username}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Delete button on hover */}
                <button
                  onClick={e => deleteTask(task.id, e)}
                  className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-red-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-red-500 shadow-md z-10"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-cardBg border border-borderColor rounded-xl shadow-2xl w-full max-w-lg p-8 relative">
            <h3 className="text-xl font-bold text-white mb-6 tracking-tight">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h3>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="input-auth-label">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  required className="input-auth" placeholder="Task title" autoFocus />
              </div>

              <div>
                <label className="input-auth-label">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows="2" className="input-auth resize-none" placeholder="Optional description…" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-auth-label">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="input-auth appearance-none cursor-pointer">
                    <option value="Pending">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Done</option>
                  </select>
                </div>
                <div>
                  <label className="input-auth-label">Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="input-auth appearance-none cursor-pointer">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-auth-label">Assignee</label>
                  {team ? (
                    <select value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                      className="input-auth appearance-none cursor-pointer">
                      <option value="">Unassigned</option>
                      {(team.members_details || []).map(m => (
                        <option key={m.id} value={String(m.id)}>{m.username}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="input-auth text-textMuted text-sm opacity-60">Select team first</div>
                  )}
                </div>
                <div>
                  <label className="input-auth-label">Due Date</label>
                  <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })}
                    className="input-auth" />
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-darkBg text-white border border-borderColor rounded-lg font-bold text-sm hover:bg-[#1A1C20] transition-colors">
                  CANCEL
                </button>
                <button type="submit" className="flex-1 btn-auth">SAVE TASK</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
