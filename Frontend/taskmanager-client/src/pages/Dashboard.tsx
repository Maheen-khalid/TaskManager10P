import React, { useState } from "react";
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

const Column = ({ title, tasks, onAdd }: { title: string; tasks: any[]; onAdd: () => void }) => (
  <div className="dashboard-column">
    <div className="dashboard-column-header">
      <h2>{title}</h2>
      <span className="dashboard-more">⋮</span>
    </div>
    <div className="dashboard-task-list">
      {tasks.map((task) => (
        <motion.div layout key={task.id} className="dashboard-task-card">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </motion.div>
      ))}
      <button className="dashboard-add-task" onClick={onAdd}><FiPlus /> Add Task</button>
    </div>
  </div>
);

const TaskModal = ({ isOpen, onClose, onSubmit }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}><FiX /></button>
        <h2>Add New Task</h2>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        <button className="modal-submit" onClick={() => onSubmit({ title, description })}>Add Task</button>
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

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const openModal = (type: "todo" | "inProgress" | "done") => {
    setTaskType(type);
    setModalOpen(true);
  };

  const addTask = ({ title, description }: { title: string; description: string }) => {
    const newTask = { id: Date.now(), title, description };
    setData((prev) => ({ ...prev, [taskType]: [...prev[taskType], newTask] }));
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
          <Column title="To Do" tasks={data.todo} onAdd={() => openModal("todo")} />
          <Column title="In Progress" tasks={data.inProgress} onAdd={() => openModal("inProgress")} />
          <Column title="Done" tasks={data.done} onAdd={() => openModal("done")} />
        </div>
      </div>
      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={addTask} />
    </div>
  );
};

export default Dashboard;

