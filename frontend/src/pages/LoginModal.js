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
