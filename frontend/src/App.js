import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import logo from './assets/logo-cyberbox.png';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

const roleLabels = {
  admin: 'Administrador',
  manager: 'Gestor',
  user: 'Utilizador',
};

function SimpleDialog({ show, title, description, onClose, children, size = 'modal-dialog' }) {
  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className={`${size} modal-dialog-scrollable`}>
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">{title}</h5>
              {description ? <div className="small text-muted mt-1">{description}</div> : null}
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

const HOMEPAGE_DEFAULTS = {
  title: 'Cibersegurança para organizações que não podem parar',
  description: 'Num contexto em que os ataques cibernéticos aumentam todos os dias, as organizações precisam de proteger os seus sistemas, dados e serviços críticos. Apoiamos empresas e entidades públicas na redução do risco cibernético, no cumprimento de requisitos regulatórios, incluindo a Diretiva Europeia NIS2, e no reforço da sua postura de segurança.',
};

function HomeScreen({ onOpenLogin }) {
  const [showNis2, setShowNis2] = useState(false);
  const homepageTitle = localStorage.getItem('hp_title') || HOMEPAGE_DEFAULTS.title;
  const homepageDesc = localStorage.getItem('hp_desc') || HOMEPAGE_DEFAULTS.description;

  const servicosNis2 = [
    'Análise de enquadramento da entidade',
    'Avaliação de maturidade de cibersegurança',
    'Análise e gestão de risco',
    'Definição de políticas e procedimentos',
    'Implementação de controlos técnicos e organizacionais',
    'Apoio à gestão e comunicação de incidentes',
  ];

  return (
    <div className="min-vh-100 bg-white">
      <div className="topbar py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3 text-white">
            <img src={logo} alt="CyberBoxSecurity" width="56" height="56" />
            <h1 className="h3 m-0">CyberBoxSecurity</h1>
          </div>
          <button className="btn btn-primary px-4 py-2" onClick={onOpenLogin}>ENTRAR</button>
        </div>
      </div>

      <div className="container py-5">
        <section className="mb-5 pb-4 border-bottom">
          <h2 className="hero-title fw-bold mb-4">{homepageTitle}</h2>
          <p className="text-secondary fs-5">{homepageDesc}</p>
        </section>

        <section className="mb-5">
          <h3 className="section-title mb-3">O contexto atual</h3>
          <p className="text-secondary mb-3">A cibersegurança tornou-se uma prioridade estratégica para organizações públicas e privadas.</p>
          <div className="row g-3 mb-4">
            <div className="col-md-6"><div className="context-chip p-3">Ataques de ransomware</div></div>
            <div className="col-md-6"><div className="context-chip p-3">Exploração de vulnerabilidades</div></div>
            <div className="col-md-6"><div className="context-chip p-3">Ataques a infraestruturas críticas</div></div>
            <div className="col-md-6"><div className="context-chip p-3">Campanhas de phishing direcionado</div></div>
          </div>
          <div className="context-note p-4 text-secondary">
            Muitas organizações descobrem tarde demais que não estavam preparadas para um incidente de segurança. Além do impacto operacional,
            existem hoje obrigações legais e regulatórias que exigem a implementação de medidas adequadas de cibersegurança.
          </div>
        </section>

        <hr className="my-5" />

        <section className="mb-5">
          <h3 className="section-title mb-3">Regulamentação Europeia</h3>
          <p className="text-secondary mb-3">
            A União Europeia reforçou os requisitos de segurança através da diretiva <strong className="text-dark">NIS2 - Network and Information Security Directive</strong>.
          </p>
          <div className="row g-3">
            <div className="col-md-4"><div className="context-chip p-3 text-center">Sanções financeiras significativas</div></div>
            <div className="col-md-4"><div className="context-chip p-3 text-center">Responsabilidade da gestão</div></div>
            <div className="col-md-4"><div className="context-chip p-3 text-center">Impacto reputacional</div></div>
          </div>
        </section>

        <hr className="my-5" />

        <section className="mb-5">
          <h3 className="section-title mb-3">Como ajudamos</h3>
          <div className="row g-3">
            <div className="col-md-6"><div className="context-chip p-3">Avaliação de maturidade de cibersegurança</div></div>
            <div className="col-md-6"><div className="context-chip p-3">Implementação de requisitos da diretiva NIS2</div></div>
            <div className="col-md-6"><div className="context-chip p-3">Auditorias de segurança e testes técnicos</div></div>
            <div className="col-md-6"><div className="context-chip p-3">Programas de formação e security awareness</div></div>
          </div>
        </section>

        <hr className="my-5" />

        <section className="mb-5">
          <h3 className="section-title mb-4">Serviços</h3>
          <div className="context-chip p-4 mb-4">
            <h4 className="h5">Implementação da Diretiva NIS2</h4>
            <div className="row g-2">
              {servicosNis2.map((item) => <div className="col-md-6" key={item}>- {item}</div>)}
            </div>
          </div>
          <div className="text-center mb-4">
            <button className="btn btn-primary px-4" onClick={() => setShowNis2(true)}>NIS2 em Portugal - Saiba Mais</button>
          </div>
        </section>
      </div>

      <section className="topbar py-5">
        <div className="container text-white">
          <h3 className="h2">Contactos</h3>
          <p className="mb-0">
            Se pretende avaliar o nível de segurança da sua organização ou preparar-se para os requisitos da Diretiva NIS2, entre em contacto connosco
            para uma avaliação inicial de maturidade de cibersegurança.
          </p>
        </div>
      </section>

      <SimpleDialog
        show={showNis2}
        title="NIS2 em Portugal"
        description="Diretiva Europeia de Cibersegurança"
        onClose={() => setShowNis2(false)}
        size="modal-dialog modal-lg"
      >
        <div className="d-grid gap-3">
          <div className="detail-box">
            <div className="small text-muted">O que é a NIS2</div>
            <div>A NIS2 reforça a cibersegurança e a resiliência digital das organizações essenciais e importantes.</div>
          </div>
          <div className="detail-box">
            <div className="small text-muted">Em Portugal</div>
            <div>Transposta pelo Decreto-Lei n.º 125/2025, com supervisão do CNCS.</div>
          </div>
          <div className="detail-box">
            <div className="small text-muted">Sanções</div>
            <div>Até 10 milhões de euros ou 2% do volume de negócios para entidades essenciais.</div>
          </div>
        </div>
      </SimpleDialog>
    </div>
  );
}

function LoginModal({ show, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    try {
      setIsSubmitting(true);
      setLoginError('');
      const response = await api.post('/auth/login', {
        username: username.trim(),
        password: password.trim(),
      });
      onLogin(response.data.user);
      setUsername('');
      setPassword('');
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Não foi possível iniciar sessão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Iniciar Sessão</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <label className="form-label">Nome de Utilizador</label>
              <input className="form-control mb-3" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <label className="form-label">Senha</label>
              <input type="password" className="form-control mb-3" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {loginError ? <div className="alert alert-danger py-2">{loginError}</div> : null}
              <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>{isSubmitting ? 'A entrar...' : 'Entrar'}</button>
            </form>
            <div className="small text-muted mt-3">Administrador por defeito: admin / admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ item, title, onClose }) {
  if (!item) return null;

  return (
    <SimpleDialog show={Boolean(item)} title={title} description={item.title || item.name} onClose={onClose}>
      <div className="d-grid gap-3">
        {Object.entries(item).map(([key, value]) => (
          <div className="detail-box" key={key}>
            <div className="small text-muted text-capitalize">{key}</div>
            <div>{String(value)}</div>
          </div>
        ))}
      </div>
    </SimpleDialog>
  );
}

function ChatSection({ user }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatError, setChatError] = useState('');

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await api.get('/chat?room=global');
        setMessages(response.data.data || []);
        setChatError('');
      } catch (error) {
        setChatError(error.response?.data?.message || 'Nao foi possivel carregar o chat.');
      }
    };

    loadMessages();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const response = await api.post('/chat', {
        senderId: user.id,
        senderName: user.nome,
        senderRole: user.perfil,
        room: 'global',
        message: message.trim(),
      });
      setMessages((current) => [...current, response.data.data]);
      setMessage('');
      setChatError('');
    } catch (error) {
      setChatError(error.response?.data?.message || 'Nao foi possivel enviar a mensagem.');
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h3 className="h5 mb-3">Chat Operacional</h3>
        {chatError ? <div className="alert alert-danger py-2">{chatError}</div> : null}
        <div className="chat-box mb-3">
          {messages.map((item) => (
            <div className="chat-bubble" key={item.id}>
              <div className="small text-muted mb-1">{item.author}</div>
              <div>{item.text}</div>
            </div>
          ))}
        </div>
        <form className="d-flex gap-2" onSubmit={submit}>
          <input className="form-control" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escreva uma mensagem" />
          <button className="btn btn-primary" type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}
function PrivateChatBox({ user, room, partnerName }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const loadMessages = useCallback(async () => {
    try {
      const response = await api.get(`/chat?room=${encodeURIComponent(room)}`);
      setMessages(response.data.data || []);
      setError('');
    } catch {
      setError('Não foi possível carregar as mensagens.');
    }
  }, [room]);

  useEffect(() => {
    setMessages([]);
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const response = await api.post('/chat', {
        senderId: user.id,
        senderName: user.nome,
        senderRole: user.perfil,
        room,
        message: message.trim(),
      });
      setMessages((prev) => [...prev, response.data.data]);
      setMessage('');
    } catch {
      setError('Não foi possível enviar a mensagem.');
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white border-bottom py-3 d-flex align-items-center gap-2">
        <div className="list-avatar manager" style={{ width: 32, height: 32, fontSize: '0.85rem', flexShrink: 0 }}>
          {partnerName.charAt(0).toUpperCase()}
        </div>
        <strong>{partnerName}</strong>
      </div>
      <div className="card-body p-0 d-flex flex-column" style={{ height: 420 }}>
        {error ? <div className="alert alert-danger m-2 py-1 small">{error}</div> : null}
        <div className="flex-grow-1 overflow-auto p-3 d-flex flex-column gap-2">
          {messages.length === 0 ? (
            <div className="text-center text-muted small mt-4">Sem mensagens ainda. Inicie a conversa!</div>
          ) : null}
          {messages.map((msg) => {
            const isOwn = msg.author === user.nome;
            return (
              <div key={msg.id} className={`d-flex ${isOwn ? 'justify-content-end' : 'justify-content-start'}`}>
                <div style={{
                  maxWidth: '70%',
                  padding: '8px 12px',
                  borderRadius: isOwn ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: isOwn ? '#1b3f9a' : '#f1f5f9',
                  color: isOwn ? '#fff' : '#1a1a2e',
                }}>
                  {!isOwn && <div style={{ fontSize: '0.72rem', opacity: 0.65, marginBottom: 2 }}>{msg.author}</div>}
                  <div style={{ fontSize: '0.9rem' }}>{msg.text}</div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.55, marginTop: 3, textAlign: 'right' }}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-top p-2">
          <form className="d-flex gap-2" onSubmit={send}>
            <input
              className="form-control form-control-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva uma mensagem..."
            />
            <button className="btn btn-primary btn-sm px-3" type="submit">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function UserChatSection({ user }) {
  if (!user.managerId) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5 text-muted">
          <p className="mb-1 fw-medium">Sem gestor atribuído</p>
          <p className="small mb-0">Contacte o administrador para ser associado a um gestor.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="h5 mb-3">Chat com o Gestor</h3>
      <PrivateChatBox
        user={user}
        room={`user_${user.id}_manager_${user.managerId}`}
        partnerName="Gestor"
      />
    </div>
  );
}

function ManagerChatSection({ user }) {
  const [clients, setClients] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/users?managerId=${user.id}`);
        setClients(res.data.data || []);
      } catch {
        // silently fail
      }
    };
    load();
  }, [user.id]);

  const conversations = [
    { room: `admin_manager_${user.id}`, name: 'Administrador', avatar: 'admin-avatar' },
    ...clients.map((c) => ({ room: `user_${c.id}_manager_${user.id}`, name: c.name, avatar: 'list-avatar user' })),
  ];

  if (selectedConv) {
    return (
      <div>
        <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => setSelectedConv(null)}>
          ← Voltar às conversas
        </button>
        <PrivateChatBox user={user} room={selectedConv.room} partnerName={selectedConv.name} />
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h3 className="h5 mb-3">Conversas</h3>
        {conversations.length === 0 ? (
          <p className="text-muted small">Sem conversas disponíveis.</p>
        ) : (
          <div className="d-grid gap-2">
            {conversations.map((conv) => (
              <button
                key={conv.room}
                className="btn btn-outline-secondary text-start d-flex align-items-center gap-3 py-3"
                onClick={() => setSelectedConv(conv)}
              >
                <div className={conv.avatar} style={{ width: 36, height: 36, fontSize: '0.9rem', flexShrink: 0 }}>
                  {conv.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="fw-medium">{conv.name}</div>
                  <div className="small text-muted">Clique para abrir conversa</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminChatSection({ user, managers }) {
  const [selectedManager, setSelectedManager] = useState(null);

  if (selectedManager) {
    return (
      <div>
        <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => setSelectedManager(null)}>
          ← Voltar às conversas
        </button>
        <PrivateChatBox
          user={user}
          room={`admin_manager_${selectedManager.id}`}
          partnerName={selectedManager.name}
        />
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h3 className="h5 mb-3">Chat com Gestores</h3>
        {managers.length === 0 ? (
          <p className="text-muted small">Sem gestores registados. Adicione um gestor para iniciar uma conversa.</p>
        ) : (
          <div className="d-grid gap-2">
            {managers.map((mgr) => (
              <button
                key={mgr.id}
                className="btn btn-outline-secondary text-start d-flex align-items-center gap-3 py-3"
                onClick={() => setSelectedManager(mgr)}
              >
                <div className="list-avatar manager" style={{ width: 36, height: 36, fontSize: '0.9rem', flexShrink: 0 }}>
                  {mgr.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="fw-medium">{mgr.name}</div>
                  <div className="small text-muted">{mgr.department || mgr.email || 'Gestor'}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppSidebar({ title, user, items, activeMenu, onSelect, onLogout, alertCount = 0, avatarClass = 'admin-avatar' }) {
  return (
    <aside className="admin-sidebar text-white p-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <img src={logo} alt="CyberBox" width="34" height="34" />
        <strong className="fs-5">{title}</strong>
      </div>

      <div className="admin-profile mb-4">
        <div className={avatarClass}>{user.nome.charAt(0).toUpperCase()}</div>
        <div>
          <div>{user.nome}</div>
          <div className="small text-white-50">{roleLabels[user.perfil]}</div>
        </div>
      </div>

      <div className="admin-menu">
        {items.map((item) => (
          <button key={item.id} className={`btn admin-menu-btn ${activeMenu === item.id ? 'active' : ''}`} onClick={() => onSelect(item.id)}>
            {item.label}
            {item.id === 'alerts' && alertCount ? <span className="admin-badge">{alertCount}</span> : null}
          </button>
        ))}
      </div>

      <button className="btn btn-outline-light w-100 mt-4" onClick={onLogout}>Sair</button>
    </aside>
  );
}

function DashboardLayout({ user, title, subtitle, menuItems, activeMenu, onSelectMenu, onLogout, children, alertCount = 0, avatarClass }) {
  return (
    <div className="admin-shell">
      <AppSidebar
        title="CyberBoxSecurity"
        user={user}
        items={menuItems}
        activeMenu={activeMenu}
        onSelect={onSelectMenu}
        onLogout={onLogout}
        alertCount={alertCount}
        avatarClass={avatarClass}
      />

      <div className="admin-main">
        <header className="admin-header px-4 px-md-5 py-4">
          <div>
            <h2 className="mb-1">{title}</h2>
            <p className="text-muted mb-0">{subtitle}</p>
          </div>
        </header>
        <main className="p-4 p-md-5">{children}</main>
      </div>
    </div>
  );
}

function exportCSV(headers, rows, filename) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))];
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function openExecutiveReport(summary, generatedAt) {
  const fmt = (n) => String(n ?? 0);
  const date = new Date(generatedAt).toLocaleString('pt-PT');
  const html = `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8"/>
<title>Relatório Executivo — CyberBoxSecurity</title>
<style>
  body{font-family:Arial,sans-serif;margin:40px;color:#1a1a2e}
  h1{color:#1b3f9a;border-bottom:3px solid #1b3f9a;padding-bottom:8px}
  h2{color:#1b3f9a;margin-top:32px;font-size:1.1rem;text-transform:uppercase;letter-spacing:.05em}
  table{width:100%;border-collapse:collapse;margin-top:8px}
  th{background:#1b3f9a;color:#fff;padding:8px 12px;text-align:left}
  td{padding:8px 12px;border-bottom:1px solid #e2e8f0}
  tr:nth-child(even) td{background:#f8fafc}
  .kpi{display:inline-block;background:#f1f5f9;border-left:4px solid #1b3f9a;padding:12px 20px;margin:6px;min-width:160px}
  .kpi-value{font-size:2rem;font-weight:700;color:#1b3f9a}
  .kpi-label{font-size:.8rem;color:#64748b;text-transform:uppercase}
  .footer{margin-top:48px;font-size:.8rem;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px}
  @media print{body{margin:20px}.no-print{display:none}}
</style>
</head>
<body>
<div class="no-print" style="margin-bottom:24px">
  <button onclick="window.print()" style="background:#1b3f9a;color:#fff;border:none;padding:10px 24px;border-radius:4px;cursor:pointer;font-size:1rem">Imprimir / Guardar como PDF</button>
</div>
<h1>Relatório Executivo — CyberBoxSecurity</h1>
<p style="color:#64748b">Gerado a: <strong>${date}</strong></p>

<h2>Utilizadores e Organizações</h2>
<div>
  <div class="kpi"><div class="kpi-value">${fmt(summary.utilizadores.total)}</div><div class="kpi-label">Utilizadores</div></div>
  <div class="kpi"><div class="kpi-value">${fmt(summary.utilizadores.gestores)}</div><div class="kpi-label">Gestores</div></div>
  <div class="kpi"><div class="kpi-value">${fmt(summary.utilizadores.admins)}</div><div class="kpi-label">Administradores</div></div>
  <div class="kpi"><div class="kpi-value">${fmt(summary.empresas.total)}</div><div class="kpi-label">Empresas</div></div>
</div>

<h2>Tickets de Suporte</h2>
<div>
  <div class="kpi"><div class="kpi-value">${fmt(summary.tickets.total)}</div><div class="kpi-label">Total</div></div>
  <div class="kpi"><div class="kpi-value">${fmt(summary.tickets.abertos)}</div><div class="kpi-label">Abertos</div></div>
  <div class="kpi"><div class="kpi-value">${fmt(summary.tickets.emCurso)}</div><div class="kpi-label">Em Curso</div></div>
  <div class="kpi"><div class="kpi-value">${fmt(summary.tickets.fechados)}</div><div class="kpi-label">Fechados</div></div>
  <div class="kpi"><div class="kpi-value">${fmt(summary.tickets.taxaResolucao)}%</div><div class="kpi-label">Taxa de Resolução</div></div>
</div>
<table style="margin-top:16px;max-width:400px">
  <tr><th>Prioridade</th><th>Tickets</th></tr>
  <tr><td>Alta</td><td>${fmt(summary.tickets.prioridadeAlta)}</td></tr>
  <tr><td>Crítica</td><td>${fmt(summary.tickets.prioridadeCritica)}</td></tr>
</table>

<h2>Atividade de Autenticação (hoje)</h2>
<div>
  <div class="kpi"><div class="kpi-value">${fmt(summary.logs.totalHoje)}</div><div class="kpi-label">Eventos</div></div>
  <div class="kpi"><div class="kpi-value">${fmt(summary.logs.loginsFalhadosHoje)}</div><div class="kpi-label">Logins Falhados</div></div>
  <div class="kpi"><div class="kpi-value">${fmt(summary.logs.registosHoje)}</div><div class="kpi-label">Novos Registos</div></div>
</div>

<div class="footer">CyberBoxSecurity &mdash; Documento gerado automaticamente. Para uso interno.</div>
</body></html>`;
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); }
}

function AdminDashboard({ user, onLogout }) {
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
  const [hpTitle, setHpTitle] = useState(localStorage.getItem('hp_title') || HOMEPAGE_DEFAULTS.title);
  const [hpDesc, setHpDesc] = useState(localStorage.getItem('hp_desc') || HOMEPAGE_DEFAULTS.description);
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
                      <span className={`alert-dot ${alert.type === 'Crítico' ? 'critical' : alert.type === 'Aviso' ? 'warning' : 'info'}`}></span>
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
            {/* Header com auto-refresh */}
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
                {/* KPI Cards */}
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

                <div className="row g-3">
                  {/* Estado dos Serviços */}
                  <div className="col-lg-4">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-body">
                        <h6 className="fw-semibold mb-3">Estado dos Serviços</h6>
                        <div className="d-grid gap-2">
                          {monitoringData.servicos.map((s) => (
                            <div key={s.nome} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                              <div>
                                <div className="fw-medium small">{s.nome}</div>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{s.descricao}</div>
                              </div>
                              <span className={`badge ${s.estado === 'online' ? 'text-bg-success' : s.estado === 'degradado' ? 'text-bg-warning' : 'text-bg-danger'}`}>
                                {s.estado === 'online' ? 'Online' : s.estado === 'degradado' ? 'Degradado' : 'Offline'}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 d-flex align-items-center gap-2">
                          <span className="badge text-bg-success rounded-pill" style={{ width: 10, height: 10, padding: 0 }}>&nbsp;</span>
                          <span className="small text-muted">Todos os serviços operacionais</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Eventos Recentes */}
                  <div className="col-lg-8">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-body">
                        <h6 className="fw-semibold mb-3">Eventos Recentes</h6>
                        {monitoringData.ultimosEventos.length === 0 ? (
                          <p className="text-muted small">Sem eventos registados.</p>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-sm align-middle mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th style={{ width: 130 }}>Hora</th>
                                  <th style={{ width: 60 }}>Origem</th>
                                  <th>Evento</th>
                                  <th style={{ width: 80 }}>Nível</th>
                                </tr>
                              </thead>
                              <tbody>
                                {monitoringData.ultimosEventos.map((ev) => {
                                  const nivelBadge = ev.nivel === 'Info'
                                    ? 'text-bg-success'
                                    : ev.nivel === 'Aviso'
                                    ? 'text-bg-warning'
                                    : 'text-bg-danger';
                                  return (
                                    <tr key={ev.id_log}>
                                      <td className="text-muted small text-nowrap">
                                        {new Date(ev.created_at).toLocaleTimeString('pt-PT')}
                                      </td>
                                      <td>
                                        <span className="badge text-bg-secondary">{ev.origem}</span>
                                      </td>
                                      <td className="small">{ev.evento}</td>
                                      <td>
                                        <span className={`badge ${nivelBadge}`}>{ev.nivel}</span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        ) : null}
