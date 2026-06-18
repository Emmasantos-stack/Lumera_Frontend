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
  useEffect(() => {
    const loadManagerData = async () => {
      try {
        const [usersResponse, ticketsResponse] = await Promise.all([
          api.get(`/users?managerId=${user.id}`),
          api.get('/tickets'),
        ]);
        setUsersList(usersResponse.data.data || []);
        setIncidentsList(ticketsResponse.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadManagerData();
  }, [user.id]);

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
        managerId: user.id,
      });

      setUsersList((current) => [response.data.data, ...current]);
      setNewUserData({ name: '', username: '', password: '', email: '', phone: '', department: '' });
      setShowAddUserDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const addIncident = () => {
    if (!newIncidentData.title.trim()) return;
    setIncidentsList((current) => [
      ...current,
      {
        id: current.length + 1,
        title: newIncidentData.title.trim(),
        severity: newIncidentData.severity,
        status: 'Pendente',
        assignee: newIncidentData.assignee || 'Não atribuído',
        date: new Date().toLocaleDateString('pt-PT'),
      },
    ]);
    setNewIncidentData({ title: '', severity: 'Média', assignee: '' });
    setShowNewIncidentDialog(false);
  };

  const openManageUser = (item) => {
    setSelectedUser(item);
    setManageData({ status: item.status, department: item.department, role: item.role });
    setShowManageUserDialog(true);
  };

  const saveManagedUser = () => {
    setUsersList((current) => current.map((entry) => (
      entry.id === selectedUser.id ? { ...entry, ...manageData } : entry
    )));
    setShowManageUserDialog(false);
    setSelectedUser(null);
  };

  const handleManagerReport = (tipo) => {
    setManagerReportLoading(tipo);
    try {
      const teamIds = new Set(usersList.map((u) => u.id));
      const teamTickets = incidentsList.filter((t) => teamIds.has(t.requesterId));
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      if (tipo === 'mensal') {
        const ticketsThisMonth = teamTickets.filter((t) => {
          const d = new Date(t.created);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        });
        const resolved = teamTickets.filter((t) => t.status === 'Fechado' || t.status === 'Resolvido');
        const open = teamTickets.filter((t) => t.status === 'Aberto');

        const rows = usersList.map((u) => {
          const userTickets = teamTickets.filter((t) => t.requesterId === u.id);
          return `<tr><td>${u.name}</td><td>${u.email || '—'}</td><td>${u.department || '—'}</td><td>${userTickets.length}</td></tr>`;
        }).join('');

        const html = `<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8"/>
<title>Relatório Mensal — ${user.nome}</title>
<style>
  body{font-family:Arial,sans-serif;margin:40px;color:#1a1a2e}
  h1{color:#1b3f9a;border-bottom:3px solid #1b3f9a;padding-bottom:8px}
  h2{color:#1b3f9a;margin-top:28px;font-size:1rem;text-transform:uppercase;letter-spacing:.05em}
  table{width:100%;border-collapse:collapse;margin-top:8px}
  th{background:#1b3f9a;color:#fff;padding:8px 12px;text-align:left}
  td{padding:8px 12px;border-bottom:1px solid #e2e8f0}
  tr:nth-child(even) td{background:#f8fafc}
  .kpi{display:inline-block;background:#f1f5f9;border-left:4px solid #1b3f9a;padding:12px 20px;margin:6px;min-width:130px}
  .kpi-value{font-size:1.8rem;font-weight:700;color:#1b3f9a}
  .kpi-label{font-size:.8rem;color:#64748b;text-transform:uppercase}
  .footer{margin-top:48px;font-size:.8rem;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px}
  @media print{.no-print{display:none}}
</style></head><body>
<div class="no-print" style="margin-bottom:20px">
  <button onclick="window.print()" style="background:#1b3f9a;color:#fff;border:none;padding:10px 24px;border-radius:4px;cursor:pointer">Imprimir / Guardar PDF</button>
</div>
<h1>Relatório Mensal — ${now.toLocaleString('pt-PT', { month: 'long', year: 'numeric' })}</h1>
<p style="color:#64748b">Gestor: <strong>${user.nome}</strong> &nbsp;|&nbsp; Gerado: <strong>${now.toLocaleString('pt-PT')}</strong></p>
<h2>Resumo</h2>
<div>
  <div class="kpi"><div class="kpi-value">${usersList.length}</div><div class="kpi-label">Membros da Equipa</div></div>
  <div class="kpi"><div class="kpi-value">${ticketsThisMonth.length}</div><div class="kpi-label">Tickets este mês</div></div>
  <div class="kpi"><div class="kpi-value">${resolved.length}</div><div class="kpi-label">Resolvidos</div></div>
  <div class="kpi"><div class="kpi-value">${open.length}</div><div class="kpi-label">Em Aberto</div></div>
</div>
<h2>Membros da Equipa</h2>
<table><thead><tr><th>Nome</th><th>Email</th><th>Departamento</th><th>Total Tickets</th></tr></thead>
<tbody>${rows || '<tr><td colspan="4" style="text-align:center;color:#94a3b8">Sem membros</td></tr>'}</tbody></table>
<div class="footer">CyberBoxSecurity — Relatório gerado automaticamente para uso interno.</div>
</body></html>`;
        const w = window.open('', '_blank');
        if (w) { w.document.write(html); w.document.close(); }
        return;
      }

      if (tipo === 'equipa') {
        const rows = usersList.map((u) => [u.id, u.name, u.username, u.email || '', u.department || '', u.ticketsOpen, u.ticketsOpen, u.status]);
        exportCSV(['ID', 'Nome', 'Username', 'Email', 'Departamento', 'Tickets Abertos', 'Total Tickets', 'Estado'], rows, 'performance_equipa.csv');
        return;
      }

      if (tipo === 'vulnerabilidades') {
        const highPrio = teamTickets.filter((t) => t.priority === 'Alta' || t.priority === 'Crítica');
        const rows = highPrio.map((t) => [t.id, t.title, t.priority, t.status, t.requester || '—', t.created]);
        exportCSV(['ID', 'Título', 'Prioridade', 'Estado', 'Requerente', 'Data'], rows, 'vulnerabilidades.csv');
        return;
      }

      if (tipo === 'resolvidos') {
        const done = teamTickets.filter((t) => t.status === 'Fechado' || t.status === 'Resolvido');
        const rows = done.map((t) => [t.id, t.title, t.priority, t.status, t.requester || '—', t.created, t.updated]);
        exportCSV(['ID', 'Título', 'Prioridade', 'Estado', 'Requerente', 'Criado', 'Resolvido'], rows, 'incidentes_resolvidos.csv');
        return;
      }
    } finally {
      setManagerReportLoading(null);
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
          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-outline-secondary" onClick={() => setShowAddUserDialog(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={addUser}>Adicionar</button>
          </div>
        </div>
      </SimpleDialog>

      <SimpleDialog show={showNewIncidentDialog} title="Novo Incidente" description="Registe um novo incidente de segurança" onClose={() => setShowNewIncidentDialog(false)}>
        <div className="d-grid gap-3">
          <input className="form-control" placeholder="Título" value={newIncidentData.title} onChange={(e) => setNewIncidentData({ ...newIncidentData, title: e.target.value })} />
          <select className="form-select" value={newIncidentData.severity} onChange={(e) => setNewIncidentData({ ...newIncidentData, severity: e.target.value })}>
            <option>Baixa</option>
            <option>Média</option>
            <option>Alta</option>
          </select>
          <select className="form-select" value={newIncidentData.assignee} onChange={(e) => setNewIncidentData({ ...newIncidentData, assignee: e.target.value })}>
            <option value="">Selecionar membro...</option>
            {teamMembers.map((member) => <option key={member.id}>{member.name}</option>)}
          </select>
          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-outline-secondary" onClick={() => setShowNewIncidentDialog(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={addIncident}>Criar Incidente</button>
          </div>
        </div>
      </SimpleDialog>

      <SimpleDialog show={showManageUserDialog} title="Gerir Utilizador" description={selectedUser?.name} onClose={() => setShowManageUserDialog(false)}>
        <div className="d-grid gap-3">
          <select className="form-select" value={manageData.status} onChange={(e) => setManageData({ ...manageData, status: e.target.value })}>
            <option>Online</option>
            <option>Offline</option>
          </select>
          <input className="form-control" placeholder="Departamento" value={manageData.department} onChange={(e) => setManageData({ ...manageData, department: e.target.value })} />
          <select className="form-select" value={manageData.role} onChange={(e) => setManageData({ ...manageData, role: e.target.value })}>
            <option>Utilizador</option>
            <option>Gestor</option>
          </select>
          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-outline-secondary" onClick={() => setShowManageUserDialog(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={saveManagedUser}>Guardar</button>
          </div>
        </div>
      </SimpleDialog>

      <DashboardLayout
        user={user}
        title="Dashboard do Gestor"
        subtitle={`Bem-vindo de volta, ${user.nome}!`}
        menuItems={menuItems}
        activeMenu={activeMenu}
        onSelectMenu={setActiveMenu}
        onLogout={onLogout}
        alertCount={alerts.length}
        avatarClass="list-avatar manager"
      >
        {activeMenu === 'dashboard' ? (
          <>
            <div className="row g-4 mb-4">
              {[
                ['Membros da Equipa', String(usersList.length)],
                ['Incidentes Resolvidos', String(incidentsList.filter((item) => item.status === 'Resolvido').length)],
                ['Incidentes Pendentes', String(incidentsList.filter((item) => item.status !== 'Resolvido').length)],
                ['Taxa de Resolução', usersList.length ? '95%' : '0%'],
              ].map(([title, value]) => (
                <div className="col-md-6 col-xl-3" key={title}>
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body">
                      <div className="text-muted small mb-2">{title}</div>
                      <div className="fs-3 fw-semibold">{value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h3 className="h5 mb-1">Incidentes Recentes</h3>
                <p className="text-muted small mb-4">Últimas atividades da equipa</p>
                <div className="d-grid gap-3">
                  {incidentsList.map((incident) => (
                    <div className="admin-list-row" key={incident.id}>
                      <div className="flex-grow-1">
                        <div className="fw-medium">{incident.title}</div>
                        <div className="small text-muted">{incident.assignee} • {incident.date}</div>
                      </div>
                      <span className="badge text-bg-secondary">{incident.status}</span>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedItem(incident)}>Ver Detalhes</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeMenu === 'team' ? (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="h5 mb-3">Membros da Equipa</h3>
              <div className="d-grid gap-3">
                {usersList.map((member) => (
                  <div className="admin-list-row" key={member.id}>
                    <div className="list-avatar manager">{member.name.charAt(0)}</div>
                    <div className="flex-grow-1">
                      <div className="fw-medium">{member.name}</div>
                      <div className="small text-muted">{member.email}</div>
                    </div>
                    <div className="text-center small"><div className="text-muted">Concluídas</div><div className="fw-semibold">{member.ticketsOpen}</div></div>
                    <div className="text-center small"><div className="text-muted">Ativas</div><div className="fw-semibold">{member.status}</div></div>
                    <div className="text-center small"><div className="text-muted">Performance</div><div className="fw-semibold text-success">{member.department || 'N/A'}</div></div>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedItem(member)}>Ver Perfil</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeMenu === 'users' ? (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="h5 mb-1">Gestão de Utilizadores</h3>
                  <p className="text-muted small mb-0">Visualizar e gerir utilizadores do sistema</p>
                </div>
              </div>
              <div className="d-grid gap-3">
                {usersList.map((item) => (
                  <div className="admin-list-row" key={item.id}>
                    <div className="list-avatar user">{item.name.charAt(0)}</div>
                    <div className="flex-grow-1">
                      <div className="fw-medium">{item.name}</div>
                      <div className="small text-muted">{item.email}</div>
                      <div className="small text-muted">Departamento: {item.username}</div>
                    </div>
                    <div className="text-center small"><div className="text-muted">Tickets</div><div className="fw-semibold">{item.ticketsOpen}</div></div>
                    <div className="small text-muted">{item.lastActive}</div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedItem(item)}>Ver Detalhes</button>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => openManageUser(item)}>Gerir</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeMenu === 'incidents' ? (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="h5 mb-1">Gestão de Incidentes</h3>
                  <p className="text-muted small mb-0">Gerir e resolver incidentes de segurança</p>
                </div>
              </div>
              <div className="d-grid gap-3">
                {incidentsList.map((item) => (
                  <div className="admin-list-row" key={item.id}>
                    <div className="flex-grow-1">
                      <div className="fw-medium">{item.title}</div>
                      <div className="small text-muted">Atribuído a: {item.assignee} • {item.date}</div>
                    </div>
                    <span className="badge text-bg-secondary">{item.status}</span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedItem(item)}>Ver Detalhes</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeMenu === 'alerts' ? (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="h5 mb-3">Alertas</h3>
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
        ) : null}

        {activeMenu === 'reports' ? (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="h5 mb-1">Relatórios da Equipa</h3>
                  <p className="text-muted small mb-0">Exportação de dados da sua equipa e incidentes</p>
                </div>
              </div>
              <div className="d-grid gap-3">
                {[
                  {
                    tipo: 'mensal',
                    nome: 'Relatório Mensal',
                    descricao: `Resumo do mês — equipa, tickets criados e estado de resolução`,
                    badge: 'HTML',
                    badgeColor: 'text-bg-primary',
                    btnLabel: 'Abrir',
                  },
                  {
                    tipo: 'equipa',
                    nome: 'Performance da Equipa',
                    descricao: 'Lista de membros com emails, departamentos e contagem de tickets',
                    badge: 'CSV',
                    badgeColor: 'text-bg-success',
                    btnLabel: 'Exportar',
                  },
                  {
                    tipo: 'vulnerabilidades',
                    nome: 'Análise de Vulnerabilidades',
                    descricao: 'Tickets de prioridade Alta e Crítica da equipa',
                    badge: 'CSV',
                    badgeColor: 'text-bg-success',
                    btnLabel: 'Exportar',
                  },
                  {
                    tipo: 'resolvidos',
                    nome: 'Incidentes Resolvidos',
                    descricao: 'Histórico completo de tickets fechados pela equipa',
                    badge: 'CSV',
                    badgeColor: 'text-bg-success',
                    btnLabel: 'Exportar',
                  },
                ].map(({ tipo, nome, descricao, badge, badgeColor, btnLabel }) => (
                  <div className="settings-row" key={tipo}>
                    <div>
                      <div className="fw-medium">{nome}</div>
                      <div className="small text-muted">{descricao}</div>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <span className={`badge ${badgeColor}`}>{badge}</span>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        disabled={managerReportLoading === tipo}
                        onClick={() => handleManagerReport(tipo)}
                      >
                        {managerReportLoading === tipo ? 'A gerar...' : btnLabel}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {usersList.length === 0 && (
                <div className="alert alert-info mt-4 mb-0 small">
                  Ainda não tem membros na equipa. Os relatórios CSV estarão vazios até adicionar utilizadores.
                </div>
              )}
            </div>
          </div>
        ) : null}

        {activeMenu === 'chat' ? <ManagerChatSection user={user} /> : null}
      </DashboardLayout>
    </>
  );
}
