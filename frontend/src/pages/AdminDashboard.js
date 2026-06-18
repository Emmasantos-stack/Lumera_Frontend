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

    const fetchMonitoring = async () => {
      try {
        setMonitoringError('');
        const res = await api.get('/monitoring/status');
        setMonitoringData(res.data.data);
      } catch {
        setMonitoringError('Não foi possível obter dados de monitorização.');
      } finally {
        setMonitoringLoading(false);
      }
    };

    setMonitoringLoading(true);
    fetchMonitoring();

    if (!autoRefresh) return;
    const interval = setInterval(fetchMonitoring, 30000);
    return () => clearInterval(interval);
  }, [activeMenu, autoRefresh]);

  useEffect(() => {
    if (activeMenu !== 'stats') return;
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await api.get('/stats/summary');
        setStatsData(res.data.data);
      } catch {
        setStatsData(null);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [activeMenu]);

  const handleExportReport = async (tipo) => {
    setReportLoading(tipo);
    try {
      if (tipo === 'executivo') {
        const res = await api.get('/reports/summary');
        openExecutiveReport(res.data.data, res.data.generatedAt);
        return;
      }
      if (tipo === 'utilizadores') {
        const res = await api.get('/users');
        const rows = (res.data.data || []).map((u) => [
          u.id, u.name, u.username, u.email || '', u.phone || '', u.department || '', u.status, u.ticketsOpen,
        ]);
        exportCSV(['ID', 'Nome', 'Username', 'Email', 'Telefone', 'Departamento', 'Estado', 'Tickets Abertos'], rows, 'utilizadores.csv');
        return;
      }
      if (tipo === 'gestores') {
        const res = await api.get('/users/managers');
        const rows = (res.data.data || []).map((m) => [
          m.id, m.name, m.username, m.email || '', m.phone || '', m.department || '', m.team, m.status,
        ]);
        exportCSV(['ID', 'Nome', 'Username', 'Email', 'Telefone', 'Departamento', 'Equipa', 'Estado'], rows, 'gestores.csv');
        return;
      }
      if (tipo === 'tickets') {
        const res = await api.get('/tickets');
        const rows = (res.data.data || []).map((t) => [
          t.id, t.titulo, t.prioridade, t.estado, t.createdBy || '', t.assignedTo || '',
          t.createdAt ? new Date(t.createdAt).toLocaleString('pt-PT') : '',
        ]);
        exportCSV(['ID', 'Título', 'Prioridade', 'Estado', 'Criado Por', 'Atribuído A', 'Data'], rows, 'tickets.csv');
        return;
      }
      if (tipo === 'logs') {
        const res = await api.get('/logs', { params: { limit: 500 } });
        const rows = (res.data.data || []).map((l) => [
          l.id_log, new Date(l.created_at).toLocaleString('pt-PT'), l.origem, l.tipo, l.actor_username || '', l.nivel, l.evento,
        ]);
        exportCSV(['ID', 'Data/Hora', 'Origem', 'Tipo', 'Utilizador', 'Nível', 'Evento'], rows, 'logs.csv');
        return;
      }
    } catch (err) {
      alert('Erro ao gerar relatório: ' + (err.response?.data?.message || err.message));
    } finally {
      setReportLoading(null);
    }
  };
  
  const validarNIF = (nif) => {
    if (!/^\d{9}$/.test(nif)) return false;
    if (nif[0] === '0') return false;
    const pesos = [9, 8, 7, 6, 5, 4, 3, 2];
    const soma = pesos.reduce((acc, peso, i) => acc + peso * parseInt(nif[i]), 0);
    const resto = soma % 11;
    const digito = resto < 2 ? 0 : 11 - resto;
    return digito === parseInt(nif[8]);
  };

  const submitEmpresa = async (e) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.nif.trim()) return;
    if (!validarNIF(form.nif)) {
      setApiMessage('NIF inválido. Deve ter 9 dígitos e ser um NIF português válido.');
      return;
    }
    try {
      await api.post('/empresas', { nome: form.nome.trim(), nif: form.nif.trim() });
      setForm({ nome: '', nif: '' });
      const response = await api.get('/empresas');
      setEmpresas(response.data.data || []);
    } catch (error) {
      setApiMessage(error.response?.data?.message || 'Não foi possível criar empresa.');
    }
  };

  const addUser = async () => {
    if (!newUserData.name.trim() || !newUserData.username.trim() || !newUserData.password.trim()) return;
    try {
      const response = await api.post('/users', {
        nome: newUserData.name.trim(),
        username: newUserData.username.trim(),
        password: newUserData.password.trim(),
        email: newUserData.email.trim(),
        telefone: newUserData.phone.trim(),
        departamento: newUserData.department.trim(),
        managerId: newUserData.managerId || null,
      });
      setUsers((current) => [response.data.data, ...current]);
      setNewUserData({ name: '', username: '', password: '', email: '', phone: '', department: '', managerId: '' });
      setShowAddUserDialog(false);
      setApiMessage('Utilizador criado com sucesso. Já pode iniciar sessão com as credenciais definidas.');
    } catch (error) {
      setApiMessage(error.response?.data?.message || 'Não foi possível criar o utilizador.');
    }
  };

  const addManager = async () => {
    if (!newManagerData.name.trim() || !newManagerData.username.trim() || !newManagerData.password.trim()) return;
    try {
      const response = await api.post('/users/managers', {
        nome: newManagerData.name.trim(),
        username: newManagerData.username.trim(),
        password: newManagerData.password.trim(),
        email: newManagerData.email.trim(),
        telefone: newManagerData.phone.trim(),
        departamento: newManagerData.department.trim(),
        teamSize: newManagerData.teamSize,
      });
      setManagers((current) => [response.data.data, ...current]);
      setNewManagerData({ name: '', username: '', password: '', email: '', phone: '', department: '', teamSize: '' });
      setShowAddManagerDialog(false);
      setApiMessage('Gestor criado com sucesso. Já pode iniciar sessão com as credenciais definidas.');
    } catch (error) {
      setApiMessage(error.response?.data?.message || 'Não foi possível criar o gestor.');
    }
  };
  
  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((current) => current.filter((entry) => entry.id !== id));
      setApiMessage('Utilizador eliminado com sucesso.');
    } catch (error) {
      setApiMessage(error.response?.data?.message || 'Não foi possível eliminar o utilizador.');
    }
  };

  const deleteManager = async (id) => {
    try {
      await api.delete(`/users/managers/${id}`);
      setManagers((current) => current.filter((entry) => entry.id !== id));
      setApiMessage('Gestor eliminado com sucesso.');
    } catch (error) {
      setApiMessage(error.response?.data?.message || 'Não foi possível eliminar o gestor.');
    }
  };

  const resolveTicket = async (id) => {
    try {
      const response = await api.put(`/tickets/${id}/status`, { estado: 'Resolvido' });
      setTickets((current) => current.map((entry) => (entry.id === id ? response.data.data : entry)));
      setApiMessage('Ticket marcado como resolvido com sucesso.');
    } catch (error) {
      setApiMessage(error.response?.data?.message || 'Nao foi possivel marcar o ticket como resolvido.');
    }
  };

  return (
    <>
      <DetailModal item={selectedItem} title="Detalhes" onClose={() => setSelectedItem(null)} />

      <SimpleDialog show={showAddUserDialog} title="Adicionar Novo Utilizador" description="Preencha os dados do novo utilizador" onClose={() => setShowAddUserDialog(false)}>
        <div className="d-grid gap-3">
          <input className="form-control" placeholder="Nome completo" value={newUserData.name} onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })} />
          <input className="form-control" placeholder="Nome de utilizador" value={newUserData.username} onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })} />
          <input type="password" className="form-control" placeholder="Senha" value={newUserData.password} onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })} />

          <input className="form-control" placeholder="Email" value={newUserData.email} onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })} />
          <input className="form-control" placeholder="Telefone" value={newUserData.phone} onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })} />
          <input className="form-control" placeholder="Departamento" value={newUserData.department} onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })} />
          <select className="form-select" value={newUserData.managerId} onChange={(e) => setNewUserData({ ...newUserData, managerId: e.target.value })}>
            <option value="">Gestor associado (opcional)</option>
            {managers.map((mgr) => (
              <option key={mgr.id} value={mgr.id}>{mgr.name} ({mgr.username})</option>
            ))}
          </select>
          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-outline-secondary" onClick={() => setShowAddUserDialog(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={addUser}>Adicionar</button>
          </div>
        </div>
      </SimpleDialog>

      <SimpleDialog show={showAddManagerDialog} title="Adicionar Novo Gestor" description="Preencha os dados do novo gestor" onClose={() => setShowAddManagerDialog(false)}>
        <div className="d-grid gap-3">
          <input className="form-control" placeholder="Nome completo" value={newManagerData.name} onChange={(e) => setNewManagerData({ ...newManagerData, name: e.target.value })} />
          <input className="form-control" placeholder="Nome de utilizador" value={newManagerData.username} onChange={(e) => setNewManagerData({ ...newManagerData, username: e.target.value })} />
          <input type="password" className="form-control" placeholder="Senha" value={newManagerData.password} onChange={(e) => setNewManagerData({ ...newManagerData, password: e.target.value })} />
          <input className="form-control" placeholder="Email" value={newManagerData.email} onChange={(e) => setNewManagerData({ ...newManagerData, email: e.target.value })} />
          <input className="form-control" placeholder="Telefone" value={newManagerData.phone} onChange={(e) => setNewManagerData({ ...newManagerData, phone: e.target.value })} />
          <input className="form-control" placeholder="Departamento" value={newManagerData.department} onChange={(e) => setNewManagerData({ ...newManagerData, department: e.target.value })} />
          <input className="form-control" placeholder="Tamanho da equipa" value={newManagerData.teamSize} onChange={(e) => setNewManagerData({ ...newManagerData, teamSize: e.target.value })} />
          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-outline-secondary" onClick={() => setShowAddManagerDialog(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={addManager}>Adicionar</button>
          </div>
        </div>
      </SimpleDialog>

      <SimpleDialog show={show2FADialog} title="Autenticação de Dois Fatores" description="Configure a autenticação de dois fatores" onClose={() => setShow2FADialog(false)}>
        <div className="d-grid gap-3">
          <label className="settings-inline"><span>Ativar 2FA</span><input type="checkbox" checked={twoFAConfig.enabled} onChange={(e) => setTwoFAConfig({ ...twoFAConfig, enabled: e.target.checked })} /></label>
          <select className="form-select" value={twoFAConfig.method} onChange={(e) => setTwoFAConfig({ ...twoFAConfig, method: e.target.value })}>
            <option>Aplicação autenticadora</option>
            <option>SMS</option>
            <option>Email</option>
          </select>
        </div>
      </SimpleDialog>

      <SimpleDialog show={showPasswordDialog} title="Política de Senhas" description="Defina os requisitos de palavra-passe" onClose={() => setShowPasswordDialog(false)}>
        <div className="d-grid gap-3">
          <input className="form-control" value={passwordConfig.minLength} onChange={(e) => setPasswordConfig({ ...passwordConfig, minLength: e.target.value })} placeholder="Comprimento mínimo" />
          <label className="settings-inline"><span>Requer letras maiúsculas</span><input type="checkbox" checked={passwordConfig.requireUppercase} onChange={(e) => setPasswordConfig({ ...passwordConfig, requireUppercase: e.target.checked })} /></label>
          <label className="settings-inline"><span>Requer números</span><input type="checkbox" checked={passwordConfig.requireNumbers} onChange={(e) => setPasswordConfig({ ...passwordConfig, requireNumbers: e.target.checked })} /></label>
          <input className="form-control" value={passwordConfig.expirationDays} onChange={(e) => setPasswordConfig({ ...passwordConfig, expirationDays: e.target.value })} placeholder="Expiração em dias" />
        </div>
      </SimpleDialog>

      <SimpleDialog show={showBackupDialog} title="Backup Automático" description="Configure a frequência de backup" onClose={() => setShowBackupDialog(false)}>
        <div className="d-grid gap-3">
          <select className="form-select" value={backupConfig.frequency} onChange={(e) => setBackupConfig({ ...backupConfig, frequency: e.target.value })}>
            <option>Diário</option>
            <option>Semanal</option>
            <option>Mensal</option>
          </select>
          <input className="form-control" value={backupConfig.time} onChange={(e) => setBackupConfig({ ...backupConfig, time: e.target.value })} placeholder="Hora" />
          <input className="form-control" value={backupConfig.retention} onChange={(e) => setBackupConfig({ ...backupConfig, retention: e.target.value })} placeholder="Retenção em dias" />
        </div>
      </SimpleDialog>

      <SimpleDialog show={showNotificationsDialog} title="Notificações de Segurança" description="Gerir canais de notificação" onClose={() => setShowNotificationsDialog(false)}>
        <div className="d-grid gap-3">
          <label className="settings-inline"><span>Email</span><input type="checkbox" checked={notificationConfig.email} onChange={(e) => setNotificationConfig({ ...notificationConfig, email: e.target.checked })} /></label>
          <label className="settings-inline"><span>SMS</span><input type="checkbox" checked={notificationConfig.sms} onChange={(e) => setNotificationConfig({ ...notificationConfig, sms: e.target.checked })} /></label>
          <label className="settings-inline"><span>Push</span><input type="checkbox" checked={notificationConfig.push} onChange={(e) => setNotificationConfig({ ...notificationConfig, push: e.target.checked })} /></label>
        </div>
      </SimpleDialog>

      <DashboardLayout
        user={user}
        title="Dashboard do Administrador"
        subtitle="Visão geral do sistema de segurança"
        menuItems={menuItems}
        activeMenu={activeMenu}
        onSelectMenu={setActiveMenu}
        onLogout={onLogout}
        alertCount={alerts.length}
      >
        {apiMessage ? <div className="alert alert-info py-2">{apiMessage}</div> : null}

        {activeMenu === 'dashboard' ? (
          <>
            <div className="row g-4 mb-4">
              {stats.map((stat) => (
                <div className="col-md-6 col-xl-3" key={stat.title}>
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body">
                      <div className="text-muted small mb-2">{stat.title}</div>
                      <div className="fs-3 fw-semibold">{stat.value}</div>
                      <div className={`small mt-2 ${stat.tone}`}>{stat.change} vs semana passada</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h3 className="h5 mb-1">Alertas Recentes</h3>
                <p className="text-muted small mb-4">Atividade de segurança em tempo real</p>
                <div className="d-grid gap-3">
                  {alerts.map((alert) => (
                    <div className="alert-row" key={alert.id}>
                      <span className={`alert-dot ${alert.type === 'Crítico' ? 'critical' : alert.type === 'Aviso' ? 'warning' : 'info'}`} />
                      <div className="flex-grow-1">
                        <div>{alert.message}</div>
                        <div className="small text-muted mt-1">{alert.source} • {alert.time}</div>
                      </div>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedItem(alert)}>Investigar</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h3 className="h5 mb-3">Nova Empresa</h3>
                <form className="row g-2 mb-4" onSubmit={submitEmpresa}>
                  <div className="col-md-5"><input className="form-control" placeholder="Nome da empresa" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
                  <div className="col-md-5"><input className="form-control" placeholder="NIF (9 dígitos)" maxLength={9} value={form.nif} onChange={(e) => setForm({ ...form, nif: e.target.value.replace(/\D/g, '').slice(0, 9) })} /></div>
                  <div className="col-md-2 d-grid"><button className="btn btn-success" type="submit">Guardar</button></div>
                </form>
                <h4 className="h6 mb-3">Empresas Registadas</h4>
                {loading ? <p className="mb-0">A carregar...</p> : (
                  <ul className="list-group">
                    {empresas.map((empresa) => (
                      <li key={empresa.id_empresa} className="list-group-item d-flex justify-content-between">
                        <span>{empresa.nome}</span>
                        <span className="text-muted">{empresa.nif}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        ) : null}

        {activeMenu === 'monitoring' ? (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="h5 mb-1">Monitorização do Sistema</h3>
                <p className="text-muted small mb-0">
                  {monitoringData
                    ? `Última atualização: ${new Date().toLocaleTimeString('pt-PT')}`
                    : 'A carregar...'}
                </p>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <div className="form-check form-switch mb-0 me-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autoRefreshToggle"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                  <label className="form-check-label small" htmlFor="autoRefreshToggle">
                    Auto-refresh (30s)
                  </label>
                </div>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => { setMonitoringLoading(true); api.get('/monitoring/status').then(r => setMonitoringData(r.data.data)).catch(() => {}).finally(() => setMonitoringLoading(false)); }}
                  disabled={monitoringLoading}
                >
                  {monitoringLoading ? '...' : '↻ Atualizar'}
                </button>
              </div>
            </div>

            {monitoringError ? (
              <div className="alert alert-danger">{monitoringError}</div>
            ) : monitoringLoading && !monitoringData ? (
              <div className="text-center py-5 text-muted">A carregar dados de monitorização...</div>
            ) : monitoringData ? (
              <>
                <div className="row g-3 mb-4">
                  {[
                    {
                      title: 'Utilizadores Online',
                      value: `${monitoringData.utilizadores.online}/${monitoringData.utilizadores.total}`,
                      sub: `${monitoringData.utilizadores.gestoresOnline}/${monitoringData.utilizadores.gestoresTotal} gestores online`,
                      color: 'text-success',
                    },
                    {
                      title: 'Tickets Abertos',
                      value: monitoringData.tickets.abertos,
                      sub: `${monitoringData.tickets.emCurso} em curso · ${monitoringData.tickets.fechados} fechados`,
                      color: monitoringData.tickets.abertos > 10 ? 'text-danger' : 'text-warning',
                    },
                    {
                      title: 'Eventos Hoje',
                      value: monitoringData.logs.eventosHoje,
                      sub: `${monitoringData.logs.loginsSuccessHoje} logins · ${monitoringData.logs.loginsFalhadosHoje} falhados`,
                      color: monitoringData.logs.loginsFalhadosHoje > 5 ? 'text-danger' : 'text-success',
                    },
                    {
                      title: 'Taxa de Resolução',
                      value: `${monitoringData.tickets.taxaResolucao}%`,
                      sub: `${monitoringData.tickets.total} tickets no total`,
                      color: monitoringData.tickets.taxaResolucao >= 70 ? 'text-success' : 'text-warning',
                    },
                  ].map(({ title, value, sub, color }) => (
                    <div className="col-md-6 col-xl-3" key={title}>
                      <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                          <div className="text-muted small mb-2">{title}</div>
                          <div className={`fs-3 fw-semibold ${color}`}>{value}</div>
                          <div className="small text-muted mt-2">{sub}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
  