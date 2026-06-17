import { useEffect, useMemo, useState } from 'react';
import { api, DashboardLayout, SimpleDialog, DetailModal, exportCSV, openExecutiveReport, AdminChatSection } from '../components/SharedComponents';

export default function AdminDashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState('');
  const [form, setForm] = useState({ nome: '', nif: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showAddManagerDialog, setShowAddManagerDialog] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [hpTitle, setHpTitle] = useState(localStorage.getItem('hp_title') || 'Cibersegurança para organizações que não podem parar');
  const [hpDesc, setHpDesc] = useState(localStorage.getItem('hp_desc') || 'Num contexto em que os ataques cibernéticos aumentam todos os dias, as organizações precisam de proteger os seus sistemas, dados e serviços críticos. Apoiamos empresas e entidades públicas na redução do risco cibernético, no cumprimento de requisitos regulatórios, incluindo a Diretiva Europeia NIS2, e no reforço da sua postura de segurança.');
  const [hpSaved, setHpSaved] = useState(false);
  const [alerts] = useState([
    { id: 1, type: 'Crítico', message: 'Tentativa de acesso não autorizado detectada', time: '2 min atrás', source: 'Sistema' },
    { id: 2, type: 'Aviso', message: 'Firewall bloqueou 15 tentativas de ataque DDoS', time: '15 min atrás', source: 'Firewall' },
    { id: 3, type: 'Informação', message: 'Atualização de segurança instalada com sucesso', time: '1 hora atrás', source: 'Admin' },
    { id: 4, type: 'Crítico', message: 'Vulnerabilidade crítica detectada no servidor #3', time: '2 horas atrás', source: 'Scanner' },
  ]);
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsFilter, setLogsFilter] = useState('todos');
  const [reportLoading, setReportLoading] = useState(null);
  const [monitoringData, setMonitoringData] = useState(null);
  const [monitoringLoading, setMonitoringLoading] = useState(false);
  const [monitoringError, setMonitoringError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', username: '', password: '', email: '', phone: '', department: '', managerId: '' });
  const [newManagerData, setNewManagerData] = useState({ name: '', username: '', password: '', email: '', phone: '', department: '', teamSize: '' });
  const [twoFAConfig, setTwoFAConfig] = useState({ enabled: false, method: 'Aplicação autenticadora' });
  const [passwordConfig, setPasswordConfig] = useState({ minLength: '8', requireUppercase: true, requireNumbers: true, expirationDays: '90' });
  const [backupConfig, setBackupConfig] = useState({ frequency: 'Diário', time: '02:00', retention: '30' });
  const [notificationConfig, setNotificationConfig] = useState({ email: true, sms: false, push: true });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'monitoring', label: 'Monitorização' },
    { id: 'tickets', label: 'Tickets' },
    { id: 'stats', label: 'Estatísticas' },
    { id: 'users', label: 'Clientes' },
    { id: 'managers', label: 'Gestores' },
    { id: 'alerts', label: 'Alertas' },
    { id: 'logs', label: 'Logs' },
    { id: 'reports', label: 'Relatórios' },
    { id: 'chat', label: 'Chat' },
    { id: 'settings', label: 'Configurações' },
    { id: 'homepage', label: 'Página Principal' },
  ];

  const stats = useMemo(() => [
    { title: 'Utilizadores Ativos', value: '1,284', change: '+12%', tone: 'text-success' },
    { title: 'Ameaças Bloqueadas', value: '3,492', change: '-8%', tone: 'text-danger' },
    { title: 'Alertas Críticos', value: String(alerts.filter((item) => item.type === 'Crítico').length), change: '+3', tone: 'text-success' },
    { title: 'Taxa de Sucesso', value: '98.5%', change: '+2.1%', tone: 'text-success' },
  ], [alerts]);

  const loadUsers = async () => {
    const response = await api.get('/users');
    setUsers(response.data.data || []);
  };

  const loadManagers = async () => {
    const response = await api.get('/users/managers');
    setManagers(response.data.data || []);
  };

  const loadTickets = async () => {
    const response = await api.get('/tickets');
    setTickets(response.data.data || []);
  };

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        setLoading(true);
        const response = await api.get('/empresas');
        setEmpresas(response.data.data || []);
        setApiMessage('');
      } catch (error) {
        setApiMessage(error.response?.data?.message || 'Erro ao listar empresas.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        await Promise.all([loadUsers(), loadManagers(), loadTickets()]);
      } catch (error) {
        setApiMessage(error.response?.data?.message || 'Erro ao listar utilizadores.');
      }
    };

    fetchSupportData();
  }, []);

  useEffect(() => {
    if (activeMenu !== 'logs') return;
    const fetchLogs = async () => {
      try {
        setLogsLoading(true);
        const res = await api.get('/logs', { params: { tipo: logsFilter } });
        setLogs(res.data.data || []);
      } catch {
        setLogs([]);
      } finally {
        setLogsLoading(false);
      }
    };
    fetchLogs();
  }, [activeMenu, logsFilter]);

  useEffect(() => {
    if (activeMenu !== 'monitoring') return;