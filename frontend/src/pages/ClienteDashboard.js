import { useEffect, useState } from 'react';
import { api, DashboardLayout, SimpleDialog, DetailModal, UserChatSection } from '../components/SharedComponents';

export default function UserDashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);
  const [newTicketData, setNewTicketData] = useState({ title: '', description: '', priority: 'Baixa' });
  const [ticketsList, setTicketsList] = useState([]);
  const [coursesList, setCoursesList] = useState([
    { id: 1, title: 'Segurança de Senhas', progress: 100, duration: '30 min', status: 'Concluído' },
    { id: 2, title: 'Phishing e Engenharia Social', progress: 100, duration: '45 min', status: 'Concluído' },
    { id: 3, title: 'Proteção de Dados Pessoais', progress: 65, duration: '60 min', status: 'Em Progresso' },
    { id: 4, title: 'Navegação Segura na Internet', progress: 0, duration: '40 min', status: 'Não Iniciado' },
  ]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tickets', label: 'Meus Tickets' },
    { id: 'chat', label: 'Chat' },
    { id: 'help', label: 'Ajuda' },
  ];

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await api.get(`/tickets?perfil=user&userId=${user.id}`);
        setTicketsList(response.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadTickets();
  }, [user.id]);

  const createTicket = async () => {
    if (!newTicketData.title.trim()) return;
    try {
      const response = await api.post('/tickets', {
        titulo: newTicketData.title.trim(),
        descricao: newTicketData.description.trim(),
        prioridade: newTicketData.priority,
        createdBy: user.id,
      });
      setTicketsList((current) => [response.data.data, ...current]);
      setNewTicketData({ title: '', description: '', priority: 'Baixa' });
      setShowNewTicketDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const openCourse = (course) => {
    const nextStatus = course.status === 'Não Iniciado' ? 'Em Progresso' : course.status;
    const nextProgress = course.status === 'Não Iniciado' ? 5 : course.progress;
    setCoursesList((current) => current.map((item) => (
      item.id === course.id ? { ...item, status: nextStatus, progress: nextProgress } : item
    )));
    setActiveCourse({ ...course, status: nextStatus, progress: nextProgress });
  };

  const progressCourse = () => {
    if (!activeCourse) return;
    const nextProgress = Math.min(activeCourse.progress + 20, 100);
    const nextStatus = nextProgress === 100 ? 'Concluído' : 'Em Progresso';
    setCoursesList((current) => current.map((item) => (
      item.id === activeCourse.id ? { ...item, progress: nextProgress, status: nextStatus } : item
    )));
    setActiveCourse({ ...activeCourse, progress: nextProgress, status: nextStatus });
  };

  return (
    <>
      <DetailModal item={selectedItem} title="Detalhes" onClose={() => setSelectedItem(null)} />

      <SimpleDialog show={showNewTicketDialog} title="Criar Novo Ticket" description="Descreva o seu problema ou pedido" onClose={() => setShowNewTicketDialog(false)}>
        <div className="d-grid gap-3">
          <input className="form-control" placeholder="Assunto" value={newTicketData.title} onChange={(e) => setNewTicketData({ ...newTicketData, title: e.target.value })} />
          <textarea className="form-control" rows="4" placeholder="Descrição" value={newTicketData.description} onChange={(e) => setNewTicketData({ ...newTicketData, description: e.target.value })}></textarea>
          <select className="form-select" value={newTicketData.priority} onChange={(e) => setNewTicketData({ ...newTicketData, priority: e.target.value })}>
            <option>Baixa</option>
            <option>Média</option>
            <option>Alta</option>
          </select>
          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-outline-secondary" onClick={() => setShowNewTicketDialog(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={createTicket}>Submeter Ticket</button>
          </div>
        </div>
      </SimpleDialog>

      <SimpleDialog show={Boolean(activeCourse)} title={activeCourse?.title} description="Conteúdo do Curso" onClose={() => setActiveCourse(null)}>
        {activeCourse ? (
          <div className="d-grid gap-3">
            <div className="d-flex justify-content-between small text-muted">
              <span>Duração: {activeCourse.duration}</span>
              <span>{activeCourse.progress}% completo</span>
            </div>
            <div className="progress" style={{ height: 12 }}>
              <div className="progress-bar" style={{ width: `${activeCourse.progress}%` }}></div>
            </div>
            <div className="detail-box">
              Este módulo aborda os principais conceitos de <strong>{activeCourse.title}</strong>, com exemplos práticos e boas práticas de segurança.
            </div>
            {activeCourse.status !== 'Concluído' ? <button className="btn btn-primary" onClick={progressCourse}>Avançar no Curso (+20%)</button> : null}
          </div>
        ) : null}
      </SimpleDialog>

      <DashboardLayout
        user={user}
        title="Dashboard do Utilizador"
        subtitle={`Bem-vindo de volta, ${user.nome}!`}
        menuItems={menuItems}
        activeMenu={activeMenu}
        onSelectMenu={setActiveMenu}
        onLogout={onLogout}
        avatarClass="list-avatar user"
      >
        {activeMenu === 'dashboard' ? (
          <>
            <div className="row g-4 mb-4">
              {[
                ['Tickets Abertos', String(ticketsList.filter((item) => item.status === 'Aberto').length)],
                ['Tickets Resolvidos', String(ticketsList.filter((item) => item.status === 'Resolvido').length)],
                ['Cursos Concluídos', String(coursesList.filter((item) => item.status === 'Concluído').length)],
              ].map(([title, value]) => (
                <div className="col-md-4" key={title}>
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body">
                      <div className="text-muted small mb-2">{title}</div>
                      <div className="fs-3 fw-semibold">{value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h3 className="h5 mb-1">Meus Tickets Recentes</h3>
                    <p className="text-muted small mb-0">Acompanhe o estado dos seus pedidos</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => setShowNewTicketDialog(true)}>Novo Ticket</button>
                </div>
                <div className="d-grid gap-3">
                  {ticketsList.slice(0, 3).map((ticket) => (
                    <div className="admin-list-row" key={ticket.id}>
                      <div className="flex-grow-1">
                        <div className="fw-medium">#{ticket.id} - {ticket.title}</div>
                        <div className="small text-muted">Criado: {ticket.created}</div>
                      </div>
                      <span className="badge text-bg-secondary">{ticket.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h3 className="h5 mb-3">Dicas de Segurança</h3>
                <div className="row g-3">
                  {[
                    ['Use senhas fortes', 'Combine letras maiúsculas, minúsculas, números e símbolos.'],
                    ['Ative a autenticação de dois fatores', 'Adicione uma camada extra de segurança às suas contas.'],
                    ['Não partilhe informações sensíveis', 'Nunca envie senhas ou dados confidenciais por email.'],
                    ['Mantenha o software atualizado', 'Instale atualizações de segurança regularmente.'],
                  ].map(([title, description]) => (
                    <div className="col-md-6" key={title}>
                      <div className="detail-box">
                        <div className="fw-medium">{title}</div>
                        <div className="small text-muted">{description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeMenu === 'tickets' ? (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="h5 mb-1">Meus Tickets</h3>
                  <p className="text-muted small mb-0">Gerir todos os seus pedidos de suporte</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowNewTicketDialog(true)}>Criar Novo Ticket</button>
              </div>
              <div className="d-grid gap-3">
                {ticketsList.map((ticket) => (
                  <div className="admin-list-row" key={ticket.id}>
                    <div className="flex-grow-1">
                      <div className="fw-medium">#{ticket.id} - {ticket.title}</div>
                      <div className="small text-muted">Prioridade: {ticket.priority} • Atualizado: {ticket.updated}</div>
                    </div>
                    <span className="badge text-bg-secondary">{ticket.status}</span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedItem(ticket)}>Ver Detalhes</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeMenu === 'chat' ? <UserChatSection user={user} /> : null}

        {activeMenu === 'help' ? (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="h5 mb-3">Centro de Ajuda</h3>
              <div className="d-grid gap-3">
                {[
                  ['Como reportar um incidente de segurança?', 'Crie um novo ticket com prioridade Alta e descreva detalhadamente o incidente.'],
                ].map(([question, answer]) => (
                  <details className="detail-box" key={question}>
                    <summary>{question}</summary>
                    <p className="small text-muted mt-3 mb-0">{answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </DashboardLayout>
    </>
  );
}
