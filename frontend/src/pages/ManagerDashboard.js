import { useEffect, useState } from 'react';
import { api, DashboardLayout, SimpleDialog, DetailModal, exportCSV, ManagerChatSection } from '../components/SharedComponents';

export default function ManagerDashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showNewIncidentDialog, setShowNewIncidentDialog] = useState(false);
  const [showManageUserDialog, setShowManageUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserData, setNewUserData] = useState({ name: '', username: '', password: '', email: '', phone: '', department: '' });
  const [newIncidentData, setNewIncidentData] = useState({ title: '', severity: 'Média', assignee: '' });
  const [manageData, setManageData] = useState({ status: 'Online', department: '', role: 'Utilizador' });
  const [alerts] = useState([
    { id: 1, type: 'Crítico', message: 'Tentativa de acesso não autorizado detectada', time: '2 min atrás', source: 'Sistema' },
    { id: 2, type: 'Aviso', message: 'Tráfego anómalo detectado na rede interna', time: '20 min atrás', source: 'Firewall' },
    { id: 3, type: 'Informação', message: 'Novo utilizador adicionado ao sistema', time: '1 hora atrás', source: 'Gestor' },
  ]);
  const [teamMembers] = useState([
    { id: 1, name: 'Carlos Mendes', role: 'Analista de Segurança', email: 'carlos@empresa.com', performance: 95, tasksCompleted: 42, tasksActive: 3, status: 'Online' },
    { id: 2, name: 'Sofia Alves', role: 'Especialista em Redes', email: 'sofia@empresa.com', performance: 92, tasksCompleted: 38, tasksActive: 2, status: 'Online' },
    { id: 3, name: 'Beatriz Lima', role: 'Analista de Vulnerabilidades', email: 'beatriz@empresa.com', performance: 94, tasksCompleted: 40, tasksActive: 2, status: 'Online' },
  ]);
  const [usersList, setUsersList] = useState([]);
  const [incidentsList, setIncidentsList] = useState([]);
  const [managerReportLoading, setManagerReportLoading] = useState(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'team', label: 'Minha Equipa' },
    { id: 'users', label: 'Clientes' },
    { id: 'incidents', label: 'Incidentes' },
    { id: 'alerts', label: 'Alertas' },
    { id: 'reports', label: 'Relatórios' },
    { id: 'chat', label: 'Chat' },
  ];
  
