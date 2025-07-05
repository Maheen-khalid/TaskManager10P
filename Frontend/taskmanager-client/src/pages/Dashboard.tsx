import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiCheckSquare,
  FiUsers,
  FiSettings,
  FiUser,
  FiBell,
  FiSun,
  FiMoon,
  FiMenu,
  FiPlus,
  FiX
} from "react-icons/fi";
import { MdEdit, MdDelete } from "react-icons/md";
import "../styles/Dashboard.css";

const tasksData = {
  todo: [
    { id: 1, title: "Create login page", description: "Design and implement UI" },
    { id: 2, title: "Setup database schema", description: "Define tables & relations" },
  ],
  inProgress: [
    { id: 3, title: "Build dashboard UI", description: "Using CSS + React" },
  ],
  done: [
    { id: 4, title: "Project structure setup", description: "Folder organization" },
  ],
};

const Sidebar = ({ collapsed, activeItem, setActiveItem }: any) => (
  <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
    <h2 className="sidebar-logo">{!collapsed && "Tasky"}</h2>
    <nav>
      <ul>
        <li className={activeItem === "dashboard" ? "active" : ""} onClick={() => setActiveItem("dashboard")}><FiGrid className="sidebar-icon" /> {!collapsed && "Dashboard"}</li>
        <li className={activeItem === "tasks" ? "active" : ""} onClick={() => setActiveItem("tasks")}><FiCheckSquare className="sidebar-icon" /> {!collapsed && "Tasks"}</li>
        <li className={activeItem === "teams" ? "active" : ""} onClick={() => setActiveItem("teams")}><FiUsers className="sidebar-icon" /> {!collapsed && "Teams"}</li>
        <li className={activeItem === "settings" ? "active" : ""} onClick={() => setActiveItem("settings")}><FiSettings className="sidebar-icon" /> {!collapsed && "Settings"}</li>
      </ul>
    </nav>
  </aside>
);

const Topbar = ({ toggleTheme, darkMode, toggleSidebar }: any) => (
  <header className="topbar">
    <div className="topbar-left">
      <button className="icon-button" onClick={toggleSidebar}><FiMenu /></button>
      <h1 className="dashboard-title">Task Management Dashboard</h1>
    </div>
    <div className="topbar-right">
      <button className="icon-button"><FiBell /></button>
      <button className="icon-button" onClick={toggleTheme}>{darkMode ? <FiSun /> : <FiMoon />}</button>
      <div className="topbar-profile">
        <FiUser className="topbar-profile-icon" />
        <span>Maheen</span>
      </div>
    </div>
  </header>
);

const StatsBar = ({ stats }: any) => (
  <div className="stats-bar">
    <div className="stat-card"><h3>{stats.total}</h3><p>Total Tasks</p></div>
    <div className="stat-card"><h3>{stats.todo}</h3><p>To Do</p></div>
    <div className="stat-card"><h3>{stats.inProgress}</h3><p>In Progress</p></div>
    <div className="stat-card"><h3>{stats.done}</h3><p>Done</p></div>
  </div>
);

const Column = ({ title, tasks, onAdd, onEdit, onDelete }: any) => (
  <div className="dashboard-column">
    <div className="dashboard-column-header">
      <h2>{title}</h2>
      <span className="dashboard-more">⋮</span>
    </div>
    <div className="dashboard-task-list">
      {tasks.map((task: any) => (
        <motion.div layout key={task.id} className="dashboard-task-card">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button className="icon-button" onClick={() => onEdit(task, title.toLowerCase().replace(" ", ""))}><MdEdit size={18} /></button>
            <button className="icon-button" onClick={() => onDelete(task.id, title.toLowerCase().replace(" ", ""))}><MdDelete size={18} /></button>
          </div>
        </motion.div>
      ))}
      <button className="dashboard-add-task" onClick={() => onAdd(title.toLowerCase().replace(" ", ""))}><FiPlus /> Add Task</button>
    </div>
  </div>
);

const TaskModal = ({ isOpen, onClose, onSubmit, editingTask }: any) => {
  const [title, setTitle] = useState(editingTask?.title || "");
  const [description, setDescription] = useState(editingTask?.description || "");

  useEffect(() => {
    setTitle(editingTask?.title || "");
    setDescription(editingTask?.description || "");
  }, [editingTask]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}><FiX /></button>
        <h2>{editingTask ? "Edit Task" : "Add New Task"}</h2>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        <button className="modal-submit" onClick={() => onSubmit({ title, description, id: editingTask?.id })}>{editingTask ? "Update Task" : "Add Task"}</button>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [modalOpen, setModalOpen] = useState(false);
  const [taskType, setTaskType] = useState<"todo" | "inProgress" | "done">("todo");
  const [data, setData] = useState(tasksData);
  const [editingTask, setEditingTask] = useState(null);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const openModal = (type: "todo" | "inProgress" | "done") => {
    setTaskType(type);
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task: any, type: "todo" | "inProgress" | "done") => {
    setTaskType(type);
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = (id: number, type: "todo" | "inProgress" | "done") => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].filter((task: any) => task.id !== id),
    }));
  };

  const handleSubmit = ({ title, description, id }: any) => {
    if (editingTask) {
      setData((prev) => ({
        ...prev,
        [taskType]: prev[taskType].map((task: any) => task.id === id ? { ...task, title, description } : task)
      }));
    } else {
      const newTask = { id: Date.now(), title, description };
      setData((prev) => ({ ...prev, [taskType]: [...prev[taskType], newTask] }));
    }
    setModalOpen(false);
  };

  const stats = {
    total: data.todo.length + data.inProgress.length + data.done.length,
    todo: data.todo.length,
    inProgress: data.inProgress.length,
    done: data.done.length,
  };

  return (
    <div className={`dashboard-layout ${darkMode ? "dark-mode" : ""}`} style={{ overflow: "hidden" }}>
      <Sidebar collapsed={sidebarCollapsed} activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="dashboard-main">
        <Topbar toggleTheme={toggleTheme} darkMode={darkMode} toggleSidebar={toggleSidebar} />
        <StatsBar stats={stats} />
        <div className="dashboard-board">
          <Column title="To Do" tasks={data.todo} onAdd={openModal} onEdit={handleEdit} onDelete={handleDelete} />
          <Column title="In Progress" tasks={data.inProgress} onAdd={openModal} onEdit={handleEdit} onDelete={handleDelete} />
          <Column title="Done" tasks={data.done} onAdd={openModal} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} editingTask={editingTask} />
    </div>
  );
};

export default Dashboard;
