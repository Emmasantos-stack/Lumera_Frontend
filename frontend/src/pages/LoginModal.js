import { useState } from 'react';
import { api } from '../components/SharedComponents';

export default function LoginModal({ show, onClose, onLogin }) {
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

